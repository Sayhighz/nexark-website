import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { Sparkles } from '../components/ui/Sparkles';

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { getItemByID } = useShop();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const itemData = await getItemByID(itemId);
        setItem(itemData);
      } catch (err) {
        setError(err.message || 'Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId, getItemByID]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'bg-blue-600';
      case 'epic': return 'bg-blue-500';
      case 'rare': return 'bg-blue-400';
      default: return 'bg-gray-500';
    }
  };

  const getRarityText = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'ตำนาน';
      case 'epic': return 'มหากาพย์';
      case 'rare': return 'หายาก';
      default: return 'ธรรมดา';
    }
  };

  const handleBuyItem = () => {
    // TODO: Implement buy functionality
    const itemName = item.item_name || item.name;
    const itemPrice = item.price;
    alert(`ซื้อ ${itemName} ในราคา ฿${itemPrice.toLocaleString()}`);
  };

  const handleGiftItem = () => {
    // TODO: Implement gift functionality
    const itemName = item.item_name || item.name;
    alert(`ส่งของขวัญ ${itemName} ให้เพื่อน`);
  };

  const handleBackToShop = () => {
    navigate('/shop');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="relative z-20 pt-20">
          <Loading size="lg" message="Loading item details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="relative z-20 pt-20">
          <ErrorMessage message={error} />
          <div className="mt-4">
            <button
              onClick={handleBackToShop}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              style={{ fontFamily: 'SukhumvitSet' }}
            >
              กลับไปร้านค้า
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <div className="relative z-20 pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'SukhumvitSet' }}>
              ไม่พบไอเทม
            </h2>
            <button
              onClick={handleBackToShop}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              style={{ fontFamily: 'SukhumvitSet' }}
            >
              กลับไปร้านค้า
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative pt-20 pb-8">
        <div className="relative z-20 text-center px-4">
          <button
            onClick={handleBackToShop}
            className="absolute left-4 top-0 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
            style={{ fontFamily: 'SukhumvitSet' }}
          >
            ← กลับไปร้านค้า
          </button>
          <h1 className="text-4xl font-bold mb-4 text-white" style={{ fontFamily: 'SukhumvitSet' }}>
            รายละเอียดไอเทม
          </h1>
        </div>
      </div>

      {/* Background band with sparkles */}
      <div className="relative mb-8">
        <div className="relative h-32 overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#7876c566] after:bg-zinc-900">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url('https://cdn.discordapp.com/attachments/820713052684419082/1002956012493471884/Server_Banner.png')`
            }}
          ></div>

          <Sparkles
            density={800}
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
            color="#8350e8"
            size={1.5}
            speed={0.3}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-5xl py-6">
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Item Image */}
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-zinc-800">
                  <img
                    src={item.image_url || item.imageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop'}
                    alt={item.item_name || item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleBuyItem}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                    style={{ fontFamily: 'SukhumvitSet' }}
                  >
                    <span>🛒</span>
                    ซื้อ - ฿{item.price ? item.price.toLocaleString() : '0'}
                  </button>
                  <button
                    onClick={handleGiftItem}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                    style={{ fontFamily: 'SukhumvitSet' }}
                  >
                    <span>🎁</span>
                    ส่งของขวัญ
                  </button>
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-5">
                {/* Title and Badges */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'SukhumvitSet' }}>
                      {item.item_name || item.name}
                    </h2>
                    {(item.is_featured || item.featured) && (
                      <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <span>⭐</span>แนะนำ
                      </div>
                    )}
                  </div>
  
                  {/* Rarity Badge */}
                  <div className="mb-4">
                    <div className={`${getRarityColor(item.rarity || 'common')} text-white text-sm font-bold px-3 py-1 rounded-full inline-block`}>
                      {getRarityText(item.rarity || 'common')}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'SukhumvitSet' }}>
                    คำอธิบาย
                  </h3>
                  <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'SukhumvitSet' }}>
                    {item.description || 'ไม่มีคำอธิบายสำหรับไอเทมนี้'}
                  </p>
                </div>

                {/* Item Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-1" style={{ fontFamily: 'SukhumvitSet' }}>
                      หมวดหมู่
                    </h4>
                    <p className="text-white font-medium text-sm" style={{ fontFamily: 'SukhumvitSet' }}>
                      {item.category?.category_name || item.category?.name || 'ไม่ระบุ'}
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-1" style={{ fontFamily: 'SukhumvitSet' }}>
                      สถานะสต็อก
                    </h4>
                    <p className="text-white font-medium text-sm" style={{ fontFamily: 'SukhumvitSet' }}>
                      {(item.stock_quantity || item.stock) === -1 ? 'มีสินค้าคงเหลือ' : `เหลือ ${item.stock_quantity || item.stock} ชิ้น`}
                    </p>
                  </div>
                </div>


                {/* Additional Info */}
                <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2" style={{ fontFamily: 'SukhumvitSet' }}>
                    💡 ข้อมูลเพิ่มเติม
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-1" style={{ fontFamily: 'SukhumvitSet' }}>
                    <li>• การซื้อจะได้รับการประมวลผลทันที</li>
                    <li>• ไอเทมจะถูกส่งตรงไปยังเซิร์ฟเวอร์ที่เลือก</li>
                    <li>• ใช้เครดิตจากยอดเงินในบัญชีของคุณ</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default ItemDetails;