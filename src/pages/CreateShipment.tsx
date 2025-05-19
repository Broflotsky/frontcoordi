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

const CreateShipment: React.FC = () => {
  // Estados para manejar los datos de los selects
  const [locations, setLocations] = useState<Location[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [shipmentCreated, setShipmentCreated] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  // Configuración de react-hook-form con zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    mode: "onChange",
    defaultValues: {
      origin_id: 0,
      destination_id: 0,
      destination_detail: "",
      product_type_id: 0,
      weight_grams: 0,
      dimensions: "",
      recipient_name: "",
      recipient_address: "",
      recipient_phone: "",
      recipient_document: "",
    },
  });

  const originId = watch("origin_id");

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

  const onSubmit = async (data: ShipmentFormValues) => {
    setApiError(null);
    setLoading(true);

    try {
      const formattedData = {
        ...data,
        origin_id: Number(data.origin_id),
        destination_id: Number(data.destination_id),
        product_type_id: Number(data.product_type_id),
        weight_grams: Number(data.weight_grams),
        recipient_phone: data.recipient_phone.toString(),
        recipient_document: data.recipient_document.toString(),
      };

      const result = await shipmentService.createShipment(formattedData);

      if (result.success) {
        setShipmentCreated(true);
        setTrackingCode(result.data.tracking_code);
        reset();
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError("Ocurrió un error inesperado. Intente nuevamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo envío después de haber creado uno exitosamente
  const handleCreateNew = () => {
    setShipmentCreated(false);
    setTrackingCode(null);
    reset();
  };

  // Si ya se creó el envío, mostrar mensaje de éxito
  if (shipmentCreated && trackingCode) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              ¡Envío creado con éxito!
            </h2>
            <p className="mt-2 text-gray-600">
              El código de seguimiento de su envío es:
            </p>
            <p className="mt-2 text-xl font-bold text-blue-600 bg-gray-100 py-2 px-4 mx-auto inline-block rounded">
              {trackingCode}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Guarde este código para realizar el seguimiento de su envío.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Crear Nuevo Envío
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Envío</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {apiError}
          </div>
        )}

        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <fieldset disabled={loading} className="space-y-4">
            {/* Sección: Origen y Destino */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="origin_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ciudad de Origen
                </label>
                <select
                  id="origin_id"
                  aria-invalid={!!errors.origin_id}
                  aria-describedby="origin_id-error"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.origin_id ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("origin_id", {
                    setValueAs: (value) => parseInt(value, 10) || 0,
                  })}
                >
                  <option value="0">Seleccione Ciudad</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.origin_id && (
                  <p id="origin_id-error" className="mt-1 text-sm text-red-600">
                    {errors.origin_id.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="destination_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ciudad de Destino
                </label>
                <select
                  id="destination_id"
                  aria-invalid={!!errors.destination_id}
                  aria-describedby="destination_id-error"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.destination_id ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("destination_id", {
                    setValueAs: (value) => parseInt(value, 10) || 0,
                  })}
                >
                  <option value="0">Seleccione Ciudad</option>
                  {locations.map((location) => (
                    <option
                      key={location.id}
                      value={location.id}
                      disabled={location.id === Number(originId)}
                    >
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.destination_id && (
                  <p
                    id="destination_id-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.destination_id.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="destination_detail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Detalles del Destino (Opcional)
                </label>
                <textarea
                  id="destination_detail"
                  aria-invalid={!!errors.destination_detail}
                  aria-describedby="destination_detail-error"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.destination_detail
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  rows={2}
                  {...register("destination_detail")}
                ></textarea>
                {errors.destination_detail && (
                  <p
                    id="destination_detail-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.destination_detail.message}
                  </p>
                )}
              </div>
            </div>

            {/* Sección: Información del Paquete */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Información del Paquete
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="product_type_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo de Producto
                  </label>
                  <select
                    id="product_type_id"
                    aria-invalid={!!errors.product_type_id}
                    aria-describedby="product_type_id-error"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.product_type_id
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("product_type_id", {
                      setValueAs: (value) => parseInt(value, 10) || 0,
                    })}
                  >
                    <option value="0">Seleccione Tipo</option>
                    {productTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.product_type_id && (
                    <p
                      id="product_type_id-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.product_type_id.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="weight_grams"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Peso (gramos)
                  </label>
                  <input
                    id="weight_grams"
                    type="number"
                    min="1"
                    aria-invalid={!!errors.weight_grams}
                    aria-describedby="weight_grams-error"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.weight_grams ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("weight_grams", {
                      setValueAs: (value) => parseInt(value, 10) || 0,
                    })}
                  />
                  {errors.weight_grams && (
                    <p
                      id="weight_grams-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.weight_grams.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="dimensions"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dimensiones (ej: 30cm x 20cm x 15cm)
                  </label>
                  <input
                    id="dimensions"
                    type="text"
                    aria-invalid={!!errors.dimensions}
                    aria-describedby="dimensions-error"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.dimensions ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ancho x Alto x Largo"
                    {...register("dimensions")}
                  />
                  {errors.dimensions && (
                    <p
                      id="dimensions-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.dimensions.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Destinatario */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Información del Destinatario
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="recipient_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre Completo
                  </label>
                  <input
                    id="recipient_name"
                    type="text"
                    aria-invalid={!!errors.recipient_name}
                    aria-describedby="recipient_name-error"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.recipient_name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("recipient_name")}
                  />
                  {errors.recipient_name && (
                    <p
                      id="recipient_name-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.recipient_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="recipient_document"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Documento de Identidad
                  </label>
                  <input
                    id="recipient_document"
                    type="number"
                    aria-invalid={!!errors.recipient_document}
                    aria-describedby="recipient_document-error"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.recipient_document
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("recipient_document", {
                      valueAsNumber: true,
                      setValueAs: (value) =>
                        value === "" ? "" : value.toString(),
                    })}
                  />
                  {errors.recipient_document && (
                    <p
                      id="recipient_document-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.recipient_document.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="recipient_phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Teléfono
                  </label>
                  <input
                    id="recipient_phone"
                    type="number"
                    inputMode="numeric"
                    aria-invalid={!!errors.recipient_phone}
                    aria-describedby="recipient_phone-error"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.recipient_phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("recipient_phone", {
                      valueAsNumber: true,
                      setValueAs: (value) =>
                        value === "" ? "" : value.toString(),
                    })}
                  />
                  {errors.recipient_phone && (
                    <p
                      id="recipient_phone-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.recipient_phone.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="recipient_address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dirección Completa
                  </label>
                  <input
                    id="recipient_address"
                    type="text"
                    aria-invalid={!!errors.recipient_address}
                    aria-describedby="recipient_address-error"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.recipient_address
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("recipient_address")}
                  />
                  {errors.recipient_address && (
                    <p
                      id="recipient_address-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.recipient_address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? "Creando Envío..." : "Crear Envío"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;
