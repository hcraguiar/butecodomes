import ButecoForm from "../components/create-form";

export default function Page() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Novo buteco</h1>
      <ButecoForm />
    </div>
  );
}
