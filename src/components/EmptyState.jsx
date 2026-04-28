const EmptyState = ({ message, icon }) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="text-gray-400 text-6xl mb-4">{icon}</div>
      )}
      <p className="text-gray-500 font-body text-lg">{message}</p>
    </div>
  )
}

export default EmptyState
