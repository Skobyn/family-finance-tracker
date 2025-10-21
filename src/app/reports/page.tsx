"use client";


import {
  Download,
  Filter,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { MainLayout } from "@/components/layout/main-layout";
import { CategoryPieChart } from "@/components/reports/category-pie-chart";
import { CategorySpendingWidget } from "@/components/reports/category-spending-widget";
import { IncomeExpensesChart } from "@/components/reports/income-expenses-chart";
import { SpendingTrendsChart } from "@/components/reports/spending-trends-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useFinancialData } from "@/hooks/use-financial-data";
import { useAuth } from '@/providers/firebase-auth-provider';

// Define the report types for the UI
type _ReportType = "overview" | "income-vs-expenses" | "category-breakdown" | "spending-trends" | "transactions" | "budget-analysis" | "custom";

// Define custom report settings interface
interface _CustomReportSettings {
  title: string;
  description: string;
  includeSections: {
    summary: boolean;
    incomeVsExpenses: boolean;
    categoryBreakdown: boolean;
    spendingTrends: boolean;
    transactions: boolean;
    budgetComparison: boolean;
  };
  filters: {
    categories: string[];
    excludeCategories: string[];
    minAmount: number | null;
    maxAmount: number | null;
  };
}

// Function to download reports as different formats
const _downloadReport = (type: 'csv' | 'pdf' | 'excel') => {
  // This would be implemented with a proper export library
  toast.success(`Report downloaded as ${type.toUpperCase()}`);
};

export default function ReportsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const financialData = useFinancialData();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });

  // Get unique categories from expenses and bills
  const getCategories = () => {
    const expenseCategories = new Set(
      (financialData.expensesData || []).map(expense => expense.category)
    );
    const billCategories = new Set(
      (financialData.billsData || []).map(bill => bill.category)
    );
    return Array.from(new Set([...expenseCategories, ...billCategories])).sort();
  };

  // Combine expenses and bills for widgets
  const getAllExpenses = () => {
    const expenses = (financialData.expensesData || []).map(expense => ({
      ...expense,
      type: 'expense'
    }));
    const bills = (financialData.billsData || []).map(bill => ({
      ...bill,
      type: 'bill'
    }));
    return [...expenses, ...bills];
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [authLoading, user, router]);

  if (authLoading || financialData.loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Loading your reports...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  const categories = getCategories();
  const allExpenses = getAllExpenses();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Analyze your spending patterns and financial trends
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker
              date={{ from: dateRange.from, to: dateRange.to }}
              onDateChange={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                }
              }}
            />
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Category Spending Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <CategorySpendingWidget
              key={index}
              expenses={allExpenses}
              categories={categories}
              defaultCategory={categories[index]}
            />
          ))}
          <Button
            variant="outline"
            className="h-[200px] border-dashed flex flex-col gap-2"
            onClick={() => {
              // Handle adding new widget
            }}
          >
            <Plus className="h-6 w-6" />
            Add Category Widget
          </Button>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Compare your income and expenses over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <IncomeExpensesChart
                incomes={financialData.incomesData || []}
                expenses={allExpenses}
                dateRange={dateRange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Distribution of expenses across categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <CategoryPieChart
                expenses={allExpenses}
                dateRange={dateRange}
              />
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>Track your spending patterns over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <SpendingTrendsChart
                expenses={allExpenses}
                dateRange={dateRange}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
