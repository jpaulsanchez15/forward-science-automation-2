import { CreateAspenForm } from "@/components/createAspenForm";

const CreatePage = () => {
  return (
    <div className="m-auto flex h-screen flex-col items-center justify-center">
      <h1 className="mb-12 text-4xl font-bold">Create an Aspen Order</h1>
      <CreateAspenForm />
    </div>
  );
};

export default CreatePage;
