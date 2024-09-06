import { CreateSageForm } from "@/components/createSageForm";
import Head from "next/head";
import Link from "next/link";

const CreatePage = () => {
  return (
    <>
      <Head>
        <title>Forward Science Automation | Create a Sage Order</title>
      </Head>
      <div className="m-auto flex flex-col items-center justify-center">
        <h1 className="mb-12 text-4xl font-bold">Create a Sage Order</h1>
        <CreateSageForm />
        <div>
          <div className="max-w-2xlpy-32 mx-auto sm:py-48 lg:py-32">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="hover:bg-vanilla relative rounded-full bg-white px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:bg-gray-400 hover:ring-gray-900/20 dark:bg-white dark:text-black dark:hover:bg-gray-400">
                Fulfill orders{" "}
                <Link href="/sage/fulfill" className="font-semibold">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePage;
