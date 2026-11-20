import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { For, createSignal } from "solid-js";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableSelectionCell,
  TableCellLayout,
} from "../table/Table";
import { Avatar } from "../avatar/Avatar";

const meta = {
  title: "Data/Table",
  tags: ["autodocs"],
  component: Table,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { name: "Ada Lovelace", role: "工程师", team: "Core" },
  { name: "Alan Turing", role: "研究员", team: "AI" },
  { name: "Grace Hopper", role: "架构师", team: "Platform" },
];

export const Default: Story = {
  name: "Table",
  render: () => (
    <Table style={{ width: "480px" }}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>姓名</TableHeaderCell>
          <TableHeaderCell>角色</TableHeaderCell>
          <TableHeaderCell>团队</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow>
            <TableCell>{r.name}</TableCell>
            <TableCell>{r.role}</TableCell>
            <TableCell>{r.team}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithSelection: Story = {
  name: "With selection",
  render: () => {
    const [checked, setChecked] = createSignal<boolean[]>(rows.map(() => false));
    return (
      <Table style={{ width: "480px" }}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell />
            <TableHeaderCell>姓名</TableHeaderCell>
            <TableHeaderCell>角色</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow>
              <TableSelectionCell
                checked={checked()[i]}
                onChange={(v) => {
                  const next = checked().slice();
                  next[i] = v;
                  setChecked(next);
                }}
              />
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const Sortable: Story = {
  name: "Sortable",
  render: () => {
    const [sort, setSort] = createSignal<{
      columnId: string;
      direction: "asc" | "desc" | null;
    }>({ columnId: "name", direction: "asc" });
    const sortedRows = () => {
      const current = sort();
      if (!current.direction) return rows;
      const key = current.columnId as keyof (typeof rows)[number];
      return [...rows].sort((a, b) => {
        const result = String(a[key]).localeCompare(String(b[key]));
        return current.direction === "asc" ? result : -result;
      });
    };
    return (
      <Table
        style={{ width: "480px" }}
        sortable
        sortColumn={sort().columnId}
        sortDirection={sort().direction ?? undefined}
        onSortChange={setSort}
      >
        <TableHeader>
          <TableRow>
            <TableHeaderCell columnId="name">姓名</TableHeaderCell>
            <TableHeaderCell columnId="role">角色</TableHeaderCell>
            <TableHeaderCell columnId="team">团队</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={sortedRows()}>
            {(r) => (
              <TableRow>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.role}</TableCell>
                <TableCell>{r.team}</TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    );
  },
};

export const CellLayout: Story = {
  name: "TableCellLayout",
  render: () => (
    <Table style={{ width: "480px" }}>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>成员</TableHeaderCell>
          <TableHeaderCell>角色</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow>
            <TableCell>
              <TableCellLayout
                media={<Avatar name={r.name} size={28} />}
                description={r.team}
              >
                {r.name}
              </TableCellLayout>
            </TableCell>
            <TableCell>{r.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
