import { Table } from "flowbite-react";

export default function DefaultTable() {
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Bill1</Table.HeadCell>
        <Table.HeadCell>Company</Table.HeadCell>
        <Table.HeadCell>Category</Table.HeadCell>
        <Table.HeadCell>Amount</Table.HeadCell>
        <Table.HeadCell>
          <span className="sr-only">Edit</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            Placeholder
          </Table.Cell>
          <Table.Cell>Placeholder</Table.Cell>
          <Table.Cell>Placeholder</Table.Cell>
          <Table.Cell>$0</Table.Cell>
          <Table.Cell>
            <a
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              href="/tables"
            >
              <p>Edit</p>
            </a>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            <p>Placeholder</p>
          </Table.Cell>
          <Table.Cell>Placeholder</Table.Cell>
          <Table.Cell>Placeholder</Table.Cell>
          <Table.Cell>$0</Table.Cell>
          <Table.Cell>
            <a
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              href="/tables"
            >
              <p>Edit</p>
            </a>
          </Table.Cell>
        </Table.Row>
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            Placeholder
          </Table.Cell>
          <Table.Cell>Placeholder</Table.Cell>
          <Table.Cell>Placeholder</Table.Cell>
          <Table.Cell>$0</Table.Cell>
          <Table.Cell>
            <a
              className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              href="/tables"
            >
              <p>Edit</p>
            </a>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
