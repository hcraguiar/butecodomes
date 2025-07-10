import ButecoForm from "@/app/ui/dashboard/butecos/create-form";


export default function Page() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Novo buteco</h1>
      <ButecoForm />
    </div>
  );
}
