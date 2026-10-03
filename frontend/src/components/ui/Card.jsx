export default function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-2xl bg-[#15151F] p-6 text-[#F5F5FA] shadow-xl shadow-black/40 border border-white/10 sm:p-8 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
