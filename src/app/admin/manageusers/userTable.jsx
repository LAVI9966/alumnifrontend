"use client";
import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Icon } from "@iconify/react";
import AddUser from "./addUserDialogue";
import gettoken from "@/app/function/gettoken";
import toast from "react-hot-toast";
import { useTheme } from "@/context/ThemeProvider";
export function UserDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  const url = process.env.NEXT_PUBLIC_URL;
  React.useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const token = await gettoken();

      const response = await fetch(`${url}/api/members/admin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });

      const data = await response.json();

      if (response.ok) {
        setData(data);
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {

      toast.error("An error occurred. Please try again.");
    }
  };
  const handleDelete = async (id) => {
    try {
      const token = await gettoken();

      const response = await fetch(`${url}/api/members/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data?.message || "successfully deleted.");
        getUser();
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handlestatus = async (val) => {

    if (!val?._id || !val?.status) {
      toast.error("Invalid user ID or status.");
      return;
    }

    try {
      const token = await gettoken();
      if (!token) {
        toast.error("Authentication failed. Please log in again.");
        return;
      }

      const response = await fetch(`${url}/api/members/${val._id}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: val.status === "pending" ? "verified" : "pending",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to change status.");
      }

      const data = await response.json();
      if (val.status === "pending") {
        toast.success(data?.message || "Successfully changed status.");
      } else {
        toast.success("Successfully changed status.");
      }

      getUser(); // Refresh user list
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },

    {
      accessorKey: "collegeNo",
      header: "College No.",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("collegeNo")}</div>
      ),
    },

    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },

    {
      accessorKey: "mobileNumber",
      header: "Mobile",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("mobileNumber")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const val = row?.original;

        return (
          <>
            <label className="flex cursor-pointer select-none items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={val.status === "verified"}
                  onChange={() => handlestatus(val)}
                  className="sr-only"
                />
                <div
                  className={`block h-8 w-14 rounded-full transition ${val.status === "verified" ? "bg-green-500" : "bg-gray-300"
                    }`}
                ></div>
                <div
                  className={`dot absolute top-1 h-6 w-6 rounded-full bg-white transition ${val.status === "verified"
                    ? "translate-x-6"
                    : "translate-x-1"
                    }`}
                ></div>
              </div>
            </label>
          </>
        );
        // <div className="capitalize">{row.getValue("status")}</div>
      },
    },
    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;

        return (
          <div>
            <AddUser
              collegeNo={event.collegeNo}
              name={event.name}
              email={event.email}
              mobileNumber={event.mobileNumber}
              getUser={getUser}
              role={event.role}
              id={event._id}
            />
            <button
              onClick={() => handleDelete(event._id)}
              className="text-red-600 underline ml-2"
            >
              Delete
            </button>{" "}
          </div>
        );
      },
    },
  ];
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 10, // Show only 10 rows per page
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-3  py-4">
        <div className="p-2 bg-white flex items-center min-w-[352px] space-x-2 rounded-3xl ">
          <Icon
            className="text-gray-500"
            icon="mynaui:search"
            width="24"
            height="24"
          />
          <input
            type="text"
            placeholder="Search Event..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className=" w-full text-black outline-none"
          />
        </div>

        <AddUser getUser={getUser} />
      </div>
      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
