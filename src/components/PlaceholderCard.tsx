export default function PlaceholderCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="aspect-video rounded-lg border bg-muted/30 flex items-center justify-center">
      <div className="text-center">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  )
}


