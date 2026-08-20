'use client'

import { Check, X } from 'lucide-react'

const ProofPreview = ({ proof, onApprove, onRevise }) => {
  const renderProof = () => {
    switch (proof.type) {
      case 'businesscard':
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-64 h-40 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div>
                <h3 className="font-bold text-lg">{proof.content.split('-')[0]?.trim() || 'Your Company'}</h3>
              </div>
              <div className="text-xs opacity-90">
                {proof.content.split('-')[1]?.trim() || 'contact@company.com'}
              </div>
            </div>
          </div>
        )
      case 'flyer':
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-56 h-72 bg-gradient-to-b from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-2xl p-6 flex flex-col justify-center items-center text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-noise"></div>
              <h2 className="text-2xl font-bold mb-4">{proof.content.split('\n')[0]}</h2>
              <p className="text-sm opacity-90">{proof.content.split('\n')[1] || 'Your message here'}</p>
            </div>
          </div>
        )
      case 'poster':
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-48 h-72 bg-black text-white rounded-lg shadow-2xl p-6 flex flex-col justify-between items-center text-center">
              <h1 className="text-3xl font-black">{proof.content.split('\n')[0]}</h1>
              <div className="text-xl font-bold text-yellow-400">{proof.content.split('\n')[1] || 'SALE'}</div>
              <p className="text-xs opacity-75">CreationStation Printing</p>
            </div>
          </div>
        )
      case 'postcard':
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-64 h-40 bg-white rounded-lg shadow-2xl p-4 border-4 border-gray-300 flex flex-col justify-between">
              <div className="border-b-2 border-gray-300 pb-2 mb-2">
                <p className="font-bold text-sm">{proof.content.split('\n')[0]}</p>
              </div>
              <p className="text-xs text-gray-600">{proof.content.split('\n')[1] || 'Your message'}</p>
              <div className="text-right text-xs">CreationStation Printing</div>
            </div>
          </div>
        )
      case 'brochure':
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-64 h-48 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg shadow-2xl p-6 text-white flex flex-col justify-between">
              <h2 className="text-2xl font-bold">{proof.content.split('\n')[0]}</h2>
              <p className="text-sm opacity-90">{proof.content.split('\n').slice(1).join(' ')}</p>
              <div className="text-xs font-semibold">Tri-fold Design</div>
            </div>
          </div>
        )
      default:
        return <div className="text-gray-500">Preview not available</div>
    }
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <h3 className="text-white font-semibold text-sm capitalize">{proof.type} Proof</h3>
      </div>
      <div className="bg-gray-50 h-64 flex items-center justify-center">{renderProof()}</div>
      <div className="p-4 space-y-3">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
          <p className="text-xs text-blue-900 font-medium">Design Details:</p>
          <p className="text-xs text-blue-800 mt-1 whitespace-pre-wrap">{proof.content}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Check size={16} />
            Approve Proof
          </button>
          <button
            onClick={onRevise}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <X size={16} />
            Request Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProofPreview
