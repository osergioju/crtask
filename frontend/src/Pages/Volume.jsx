import { Title, Text } from "@mantine/core";

export default function Volume() {
  return (
    <div className="w-full space-y-8">
      <div>
        <Title order={2}>Volume</Title>
        <Text size="sm" c="dimmed">
          Distribuição de demandas por cliente e colaborador.
        </Text>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 bg-zinc-900 rounded-xl border border-zinc-800" />
        <div className="h-96 bg-zinc-900 rounded-xl border border-zinc-800" />
      </section>
    </div>
  );
}