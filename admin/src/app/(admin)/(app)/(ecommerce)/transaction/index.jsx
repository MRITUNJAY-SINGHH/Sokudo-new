import PageBreadcrumb from "@/components/PageBreadcrumb";
import PageMeta from "@/components/PageMeta";
import TransactionDetails from "./components/TransactionDetails";
import TransactionOverview from "./components/TransactionOverview";
import TransactionTable from "./components/TransactionTable";

const TransactionsPage = () => {
  return (
    <>
      <PageMeta title="Transactions" />
      <main>
        <PageBreadcrumb title="Transactions" subtitle="Payments & Orders" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <TransactionDetails />
          <TransactionOverview />
        </div>
        <TransactionTable />
      </main>
    </>
  );
};

export default TransactionsPage;
