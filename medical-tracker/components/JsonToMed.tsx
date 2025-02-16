import { MedicationFields } from '@/components/TextExtract';

export function convertJsonToMedicationFields(json: any): MedicationFields {
  console.log(123)
  console.log(json)

  const data = json.data; // Extract the 'data' field
  console.log(data)
  return {
    pharmacyName: data.pharmacy_name ?? '',
    pharmacyAddress: data.address ?? '',
    pillName: data.pill_name ?? '',
    date: data.date ?? '',
    numberOfPills: String(data.number_of_pills) ?? '', // Convert number to string if necessary
    frequency: data.frequency ?? '',
    directions: data.directions ?? '',
    refills: data.refills ?? '',
  };
}