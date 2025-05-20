import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipmentSchema } from "../validations/shipmentSchema";
import type {
  ShipmentFormValues,
  Location,
  ProductType,
} from "../validations/shipmentSchema";
import shipmentService from "../services/shipmentService";
import FormField from "../components/ui/FormField";
import SelectField from "../components/ui/SelectField";
import DimensionsField from "../components/ui/DimensionsField";
import FormSection from "../components/shipment/FormSection";
import ShipmentCreatedSuccess from "../components/shipment/ShipmentCreatedSuccess";

const CreateShipment: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [shipmentCreated, setShipmentCreated] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    mode: "onChange",
    defaultValues: {
      origin_id: 0,
      destination_id: 0,
      destination_detail: "",
      product_type_id: 0,
      weight_grams: 0,
      width_cm: 0,
      height_cm: 0,
      length_cm: 0,
      recipient_name: "",
      recipient_address: "",
      recipient_phone: "",
      recipient_document: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = form;

  const weightGrams = watch("weight_grams");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [locationsData, productTypesData] = await Promise.all([
          shipmentService.getLocations(),
          shipmentService.getProductTypes(),
        ]);

        setLocations(locationsData);
        setProductTypes(productTypesData);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setApiError("Error al cargar las opciones. Intente nuevamente.");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (productTypes.length > 0 && weightGrams > 0) {
      const selectedProductType = productTypes.find((type) => {
        const isAboveMin = type.min_weight_grams <= weightGrams;
        const isBelowMax =
          type.max_weight_grams === null ||
          weightGrams <= type.max_weight_grams;
        return isAboveMin && isBelowMax;
      });

      if (selectedProductType) {
        setValue("product_type_id", selectedProductType.id);
      }
    }
  }, [weightGrams, productTypes, setValue]);

  const onSubmit = async (data: ShipmentFormValues) => {
    setApiError(null);
    setLoading(true);

    try {
      const combinedDimensions = `${data.width_cm}x${data.height_cm}x${data.length_cm}`;

      const formattedData = {
        ...data,
        origin_id: Number(data.origin_id),
        destination_id: Number(data.destination_id),
        product_type_id: Number(data.product_type_id),
        weight_grams: Number(data.weight_grams),
        recipient_phone: data.recipient_phone.toString(),
        recipient_document: data.recipient_document.toString(),
        dimensions: combinedDimensions,
      };

      const result = await shipmentService.createShipment(formattedData);

      if (result.success) {
        setShipmentCreated(true);
        setTrackingCode(result.data.tracking_code);
        reset();
      } else {
        setApiError(result.error || "Error al crear el envío");
      }
    } catch (error) {
      setApiError("Ocurrió un error inesperado. Intente nuevamente.");
      console.error("Error al crear envío:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setShipmentCreated(false);
    setTrackingCode(null);
    reset();
    setApiError(null);
  };

  if (shipmentCreated && trackingCode) {
    return (
      <ShipmentCreatedSuccess
        trackingCode={trackingCode}
        onCreateNew={handleCreateNew}
      />
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Envío</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {apiError && (
          <div
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
            role="alert"
          >
            {apiError}
          </div>
        )}

        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <fieldset disabled={loading} className="space-y-4">
            <FormSection title="Información del Envío">
              <SelectField
                id="origin_id"
                label="Ciudad de Origen"
                options={locations}
                error={errors.origin_id}
                required
                {...register("origin_id", {
                  setValueAs: (value) => parseInt(value, 10) || 0,
                })}
              />

              <SelectField
                id="destination_id"
                label="Ciudad de Destino"
                options={locations}
                error={errors.destination_id}
                required
                {...register("destination_id", {
                  setValueAs: (value) => parseInt(value, 10) || 0,
                })}
              />

              <FormField
                id="destination_detail"
                label="Detalles del Destino"
                placeholder="Ej: Zona norte, cerca al parque"
                error={errors.destination_detail}
                {...register("destination_detail")}
              />
            </FormSection>

            <FormSection title="Información del Producto">
              <FormField
                id="weight_grams"
                label="Peso (gramos)"
                type="number"
                min="1"
                error={errors.weight_grams}
                required
                {...register("weight_grams", {
                  setValueAs: (value) => parseInt(value, 10) || 0,
                })}
              />
              <SelectField
                id="product_type_id"
                label="Tipo de Producto (asignado automáticamente)"
                options={productTypes}
                error={errors.product_type_id}
                required
                disabled={true}
                {...register("product_type_id", {
                  setValueAs: (value) => parseInt(value, 10) || 0,
                })}
              />

              <DimensionsField
                register={register}
                watch={watch}
                errors={errors}
              />
            </FormSection>

            <FormSection title="Información del Destinatario">
              <FormField
                id="recipient_name"
                label="Nombre del Destinatario"
                error={errors.recipient_name}
                required
                {...register("recipient_name")}
              />

              <FormField
                id="recipient_document"
                label="Documento del Destinatario"
                error={errors.recipient_document}
                required
                {...register("recipient_document")}
              />

              <FormField
                id="recipient_phone"
                label="Teléfono del Destinatario"
                type="tel"
                error={errors.recipient_phone}
                required
                {...register("recipient_phone")}
              />

              <FormField
                id="recipient_address"
                label="Dirección del Destinatario"
                error={errors.recipient_address}
                required
                {...register("recipient_address")}
              />
            </FormSection>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center min-w-[150px]`}
              >
                {loading && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {loading ? "Creando envío..." : "Crear envío"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;
