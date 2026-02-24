import { Title, Text } from "@mantine/core";

export default function SLA() {
  return (
    <div className="w-full space-y-8">
      <div>
        <Title order={2}>SLA</Title>
        <Text size="sm" c="dimmed">
          Indicadores de tempo médio de entrega por tipo de demanda.
        </Text>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-32 bg-zinc-900 rounded-xl border border-zinc-800" />
        <div className="h-32 bg-zinc-900 rounded-xl border border-zinc-800" />
        <div className="h-32 bg-zinc-900 rounded-xl border border-zinc-800" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="h-80 bg-zinc-900 rounded-xl border border-zinc-800" />
        <div className="h-80 bg-zinc-900 rounded-xl border border-zinc-800" />
      </section>
    </div>
  );
}