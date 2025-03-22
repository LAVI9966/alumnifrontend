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
import AddEvent from "./addEventDialogue";
import gettoken from "@/app/function/gettoken";
import toast from "react-hot-toast";
import RegisteredUser from "./registerusermodal";
export function EventDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);

  const url = process.env.NEXT_PUBLIC_URL;
  React.useEffect(() => {
    getEvent();
  }, []);

  const getEvent = async () => {
    try {
      const token = await gettoken();

      const response = await fetch(`${url}/api/events`, {
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
      toast.error(error || "An error occurred. Please try again.");
    }
  };
  const handleDelete = async (id) => {
    try {
      const token = await gettoken();

      const response = await fetch(`${url}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data?.message || "successfully deleted.");
        getEvent();
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
      accessorKey: "title",
      header: "Event Name",
      cell: ({ row }) => (
        <div className="capitalize max-w-[200px]">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="capitalize">
          {new Date(row.getValue("date")).toISOString().split("T")[0]}
        </div>
      ),
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize max-w-[300px]">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "registeruser",
      header: "Register User",
      cell: ({ row }) => {
        const val = row.original;
        return (
          <div>
            <RegisteredUser eventId={val._id} />
          </div>
        );
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
            <AddEvent
              getEvent={getEvent}
              id={event._id}
              title={event.title}
              description={event.description}
              date={event.date}
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
            value={table.getColumn("title")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className=" w-full outline-none"
          />
        </div>

        <AddEvent getEvent={getEvent} />
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
