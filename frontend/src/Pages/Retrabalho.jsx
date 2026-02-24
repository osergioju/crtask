import { Title, Text } from "@mantine/core";

export default function Retrabalho() {
  return (
    <div className="w-full space-y-8">
      <div>
        <Title order={2}>Retrabalho</Title>
        <Text size="sm" c="dimmed">
          Indicadores de retrabalho geral e por cliente.
        </Text>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="h-40 bg-zinc-900 rounded-xl border border-zinc-800" />
        <div className="h-80 bg-zinc-900 rounded-xl border border-zinc-800" />
      </section>
    </div>
  );
}