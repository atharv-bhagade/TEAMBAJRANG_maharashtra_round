export default function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/80 sm:p-8 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
