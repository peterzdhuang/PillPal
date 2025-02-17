import { MedicationFields } from '@/components/TextExtract';

export function convertJsonToMedicationFields(data: any): MedicationFields {
  
  return {
    pharmacy_name: data.pharmacy_name,
    address: data.address,
    pill_name: data.pill_name,
    date: data.date ?? '',
    number_of_pills: String(data.number_of_pills), // Convert number to string if necessary
    frequency: data.frequency,
    directions: data.directions,
    refills: data.refills,
  }
}