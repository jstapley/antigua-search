'use client'

export default function Modal({ isOpen, onClose, title, message, type = 'success', confirmButton = null }) {
  if (!isOpen) return null

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{icons[type]}</div>
            {title && (
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h3>
            )}
            <p className="text-gray-700 text-lg">
              {message}
            </p>
          </div>

          {confirmButton ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmButton.onClick}
                className={`flex-1 py-3 rounded-lg font-bold text-lg transition ${
                  confirmButton.danger 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {confirmButton.label}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  )
}