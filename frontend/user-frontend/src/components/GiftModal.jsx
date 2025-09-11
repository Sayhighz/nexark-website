import React, { useState } from 'react';
import { GiftOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';

const GiftModal = ({ visible, onCancel, onConfirm, item, loading }) => {
  const [recipientSteamId, setRecipientSteamId] = useState('');
  const [confirmSteamId, setConfirmSteamId] = useState('');
  const [errors, setErrors] = useState({});

  const showMessage = (text, type = 'error') => {
    // Simple toast-like message
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 z-[9999] px-4 py-2 rounded-lg text-white font-medium ${
      type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600'
    } shadow-lg`;
    messageDiv.style.fontFamily = 'SukhumvitSet';
    messageDiv.textContent = text;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 3000);
  };

  const handleConfirm = () => {
    const newErrors = {};

    if (!recipientSteamId.trim()) {
      newErrors.recipientSteamId = 'กรุณากรอก SteamID ของผู้รับ';
    }

    if (!confirmSteamId.trim()) {
      newErrors.confirmSteamId = 'กรุณายืนยัน SteamID';
    }

    if (recipientSteamId && confirmSteamId && recipientSteamId !== confirmSteamId) {
      newErrors.confirmSteamId = 'SteamID ไม่ตรงกัน กรุณาตรวจสอบ';
    }

    // Validate SteamID format (basic validation)
    if (recipientSteamId && !/^\d{17}$/.test(recipientSteamId)) {
      newErrors.recipientSteamId = 'รูปแบบ SteamID ไม่ถูกต้อง (ต้องเป็นตัวเลข 17 หลัก)';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      showMessage(firstError, 'error');
      return;
    }

    onConfirm(recipientSteamId);
  };

  const handleCancel = () => {
    setRecipientSteamId('');
    setConfirmSteamId('');
    setErrors({});
    onCancel();
  };

  const handleInputChange = (field, value) => {
    if (field === 'recipientSteamId') {
      setRecipientSteamId(value);
      if (errors.recipientSteamId) {
        setErrors(prev => ({ ...prev, recipientSteamId: null }));
      }
    } else if (field === 'confirmSteamId') {
      setConfirmSteamId(value);
      if (errors.confirmSteamId) {
        setErrors(prev => ({ ...prev, confirmSteamId: null }));
      }
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
        onClick={handleCancel}
      >
        {/* Modal */}
        <div 
          className="relative bg-zinc-900/95 backdrop-blur-md rounded-xl border border-white/20 p-6 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: 'SukhumvitSet' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <GiftOutlined className="text-xl text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">ส่งของขวัญ</h3>
                <p className="text-sm text-gray-400">{item?.item_name || item?.name}</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <CloseOutlined className="text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Info Alert */}
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <InfoCircleOutlined className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-2">วิธีการหา SteamID</p>
                  <ul className="space-y-1 text-xs text-blue-300">
                    <li>• เข้าเกม ARK แล้วกด F1 เพื่อเปิด Console</li>
                    <li>• พิมพ์คำสั่ง: <code className="bg-black/30 px-1 rounded">showmyadminmanager</code></li>
                    <li>• SteamID จะแสดงอยู่ในส่วน Admin Manager</li>
                    <li>• หรือเข้าเว็บ: <a href="https://steamid.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">steamid.io</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recipient SteamID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SteamID ของผู้รับ <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น: 76561198000000000"
                value={recipientSteamId}
                onChange={(e) => handleInputChange('recipientSteamId', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.recipientSteamId ? 'border-red-500/50' : 'border-white/20'
                }`}
                style={{ fontFamily: 'SukhumvitSet' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                SteamID ต้องเป็นตัวเลข 17 หลัก
              </p>
              {errors.recipientSteamId && (
                <p className="text-xs text-red-400 mt-1">{errors.recipientSteamId}</p>
              )}
            </div>

            {/* Confirm SteamID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ยืนยัน SteamID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="พิมพ์ SteamID อีกครั้งเพื่อยืนยัน"
                value={confirmSteamId}
                onChange={(e) => handleInputChange('confirmSteamId', e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.confirmSteamId ? 'border-red-500/50' : 'border-white/20'
                }`}
                style={{ fontFamily: 'SukhumvitSet' }}
              />
              {errors.confirmSteamId && (
                <p className="text-xs text-red-400 mt-1">{errors.confirmSteamId}</p>
              )}
            </div>

            {/* Warning */}
            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-start gap-2">
                <InfoCircleOutlined className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium mb-1">คำเตือน:</p>
                  <ul className="space-y-1 text-xs text-yellow-300">
                    <li>• ตรวจสอบ SteamID ให้ถูกต้องก่อนส่ง</li>
                    <li>• ไอเทมจะถูกส่งไปยังเซิร์ฟเวอร์ที่เลือก</li>
                    <li>• การส่งของขวัญไม่สามารถยกเลิกได้</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
              style={{ fontFamily: 'SukhumvitSet' }}
            >
              ยกเลิก
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
              style={{ fontFamily: 'SukhumvitSet' }}
            >
              <GiftOutlined />
              {loading ? 'กำลังส่ง...' : 'ส่งของขวัญ'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GiftModal;