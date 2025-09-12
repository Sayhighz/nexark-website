import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import { useAuthContext } from '../contexts/AuthContext';
import { shopService } from '../services/shopService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import GiftModal from '../components/GiftModal';
import { Sparkles } from '../components/ui/Sparkles';
import { message, Modal, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCartOutlined,
  GiftOutlined,
  LoginOutlined
} from '@ant-design/icons';

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { getItemByID } = useShop();
  const { isAuthenticated, login } = useAuthContext();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [selectedItemForGift, setSelectedItemForGift] = useState(null);
  const [giftLoading, setGiftLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const { t, i18n } = useTranslation();

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
  }, [itemId, getItemByID, i18n.language]);

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

  // Helper: show insufficient credits warning robustly
  const showInsufficientCredits = (desc) => {
    const run = () => {
      try {
        notification.warning({
          message: t('item.errors.insufficientCreditsTitle'),
          description: t('item.errors.insufficientCreditsDesc'),
          placement: 'topRight',
        });
      } catch {
        // no-op
      }
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(run);
    } else {
      setTimeout(run, 0);
    }
  };

  const handleBuyItem = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      message.warning(t('item.errors.loginRequiredBuy'));
      login();
      return;
    }

    const itemName = item.item_name || item.name;
    const priceText = typeof item.price === 'number' ? item.price.toLocaleString() : item.price;

    modal.confirm({
      title: t('item.confirm.title'),
      content: t('item.confirm.content', { item: itemName, currency: t('common.currencySymbol'), price: priceText }),
      okText: t('item.confirm.ok'),
      cancelText: t('item.confirm.cancel'),
      centered: true,
      onOk: async () => {
        try {
          setBuyLoading(true);

          // เรียก API ซื้อไอเทม
          const res = await shopService.buyItem(item.item_id || item.id);

          // กรณี Backend ส่ง 200 แต่ไม่สำเร็จ:
          // รองรับทั้งรูปแบบ success=false หรือมี error object กลับมา
          const hasErrorObject = !!res?.error;
          const isExplicitFail = res?.success === false;
          if (isExplicitFail || hasErrorObject) {
            const errorObj = res?.error || {};
            const errorCode = errorObj.code || res?.error_code || res?.code;
            const backendMessage = errorObj.message || res?.message;
            let errorMessage = backendMessage || 'เกิดข้อผิดพลาดในการซื้อไอเทม';

            if (errorCode === 'INSUFFICIENT_CREDITS') {
              if (!backendMessage) {
                errorMessage = 'เครดิตไม่เพียงพอสำหรับการซื้อไอเทมนี้';
              }
              console.log('INSUFFICIENT_CREDITS detected');
              showInsufficientCredits(errorMessage);
            } else if (errorCode === 'OUT_OF_STOCK') {
              if (!backendMessage) {
                errorMessage = 'ไอเทมนี้หมดสต๊อกแล้ว';
              }
              notification.error({
                message: t('item.errors.genericTitle'),
                description: errorMessage,
                placement: 'topRight',
              });
            } else if (errorCode === 'ITEM_NOT_FOUND') {
              if (!backendMessage) {
                errorMessage = 'ไม่พบไอเทมนี้';
              }
              notification.error({
                message: 'ซื้อไม่สำเร็จ',
                description: errorMessage,
                placement: 'topRight',
              });
            } else {
              notification.error({
                message: 'ซื้อไม่สำเร็จ',
                description: errorMessage,
                placement: 'topRight',
              });
            }
            return;
          }

          // สำเร็จ: แสดง Modal และ Notification
          // ป้องกันกรณีที่ backend เผลอส่ง error ทั้งที่ HTTP 200
          if (res?.error) {
            // ถ้ามี error object ให้จัดการเหมือน error (เพื่อความปลอดภัย)
            const errCode = res?.error?.code;
            const errMsg = res?.error?.message || 'เกิดข้อผิดพลาดในการซื้อไอเทม';
            if (errCode === 'INSUFFICIENT_CREDITS') {
              notification.warning({
                message: 'เครดิตไม่เพียงพอ',
                description: errMsg,
                placement: 'topRight',
              });
            } else {
              notification.error({
                message: 'ซื้อไม่สำเร็จ',
                description: errMsg,
                placement: 'topRight',
              });
            }
            return;
          }

          Modal.success({
            title: t('item.purchase.successTitle'),
            content: t('item.purchase.successModal', { item: itemName }),
          });
          notification.success({
            message: t('item.purchase.successTitle'),
            description: t('item.purchase.successDesc', { item: itemName }),
            placement: 'topRight',
          });
        } catch (error) {
          console.error('Buy item error:', error);

          // กรณีไม่ได้ล็อกอิน
          if (error.response?.status === 401) {
            message.error(t('item.errors.loginRequiredBuy'));
            login();
            return;
          }

          // ตรวจจับ error แบบครอบคลุม (รวมกรณี HTTP 200 แต่ interceptor โยน error)
          const data = error.response?.data || {};
          const status = error.response?.status;
          const errorObj = data.error || {};
          const errorCode = errorObj.code || data.error_code || data.code;
          let errorMessage = errorObj.message || data.message || 'เกิดข้อผิดพลาดในการซื้อไอเทม';

          // Flow ใหม่:
          // - INSUFFICIENT_CREDITS => notification.warning
          // - อื่นๆ => notification.error
          if (errorCode === 'INSUFFICIENT_CREDITS' || status === 200) {
            // แสดงเตือนเครดิตไม่พอ แม้ interceptor จะจับเป็น error
            if (!errorObj.message && !data.message) {
              errorMessage = 'เครดิตไม่เพียงพอสำหรับการซื้อไอเทมนี้';
            }
            showInsufficientCredits(errorMessage);
          } else if (errorCode === 'OUT_OF_STOCK') {
            notification.error({
              message: t('item.errors.outOfStockTitle'),
              description: t('item.errors.outOfStockDesc'),
              placement: 'topRight',
            });
          } else if (errorCode === 'ITEM_NOT_FOUND') {
            notification.error({
              message: t('item.errors.notFoundTitle'),
              description: t('item.errors.notFoundDesc'),
              placement: 'topRight',
            });
          } else {
            notification.error({
              message: t('item.errors.genericTitle'),
              description: errorMessage,
              placement: 'topRight',
            });
          }
        } finally {
          setBuyLoading(false);
        }
      },
    });
  };

  const handleGiftItem = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      message.warning(t('item.errors.loginRequiredGift'));
      login();
      return;
    }
    
    setSelectedItemForGift(item);
    setGiftModalVisible(true);
  };

  const handleGiftConfirm = async (recipientSteamId) => {
    try {
      setGiftLoading(true);
      const itemName = selectedItemForGift.item_name || selectedItemForGift.name;

      // Call the gift API and interpret 200 responses with success=false
      const res = await shopService.giftItem(
        selectedItemForGift.item_id || selectedItemForGift.id,
        recipientSteamId
      );

      if (!res?.success) {
        const errorCode = res?.error?.code;
        let errorMessage = res?.error?.message || 'เกิดข้อผิดพลาดในการส่งของขวัญ';

        // Provide user-friendly error messages
        switch (errorCode) {
          case 'INSUFFICIENT_CREDITS':
            errorMessage = 'เครดิตไม่เพียงพอสำหรับการส่งของขวัญ';
            break;
          case 'OUT_OF_STOCK':
            errorMessage = 'ไอเทมนี้หมดสต๊อกแล้ว';
            break;
          case 'ITEM_NOT_FOUND':
            errorMessage = 'ไม่พบไอเทมนี้';
            break;
          case 'INVALID_STEAM_ID':
            errorMessage = 'Steam ID ไม่ถูกต้อง';
            break;
          default:
            break;
        }

        message.error(errorMessage);
        return;
      }

      message.success(t('item.errors.giftSuccess', { item: itemName, steamId: recipientSteamId }));
      setGiftModalVisible(false);
      setSelectedItemForGift(null);
    } catch (error) {
      console.error('Gift item error:', error);
      
      // Handle specific authentication errors
      if (error.response?.status === 401) {
        message.error(t('item.errors.loginRequiredGift'));
        login();
        setGiftModalVisible(false);
        setSelectedItemForGift(null);
        return;
      }
      
      // Handle other errors
      const errorCode = error.response?.data?.error?.code;
      let errorMessage = error.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการส่งของขวัญ';
      
      // Provide user-friendly error messages
      switch (errorCode) {
        case 'INSUFFICIENT_CREDITS':
          errorMessage = 'เครดิตไม่เพียงพอสำหรับการส่งของขวัญ';
          break;
        case 'OUT_OF_STOCK':
          errorMessage = 'ไอเทมนี้หมดสต๊อกแล้ว';
          break;
        case 'ITEM_NOT_FOUND':
          errorMessage = 'ไม่พบไอเทมนี้';
          break;
        case 'INVALID_STEAM_ID':
          errorMessage = 'Steam ID ไม่ถูกต้อง';
          break;
        default:
          break;
      }
      
      message.error(errorMessage);
    } finally {
      setGiftLoading(false);
    }
  };

  const handleGiftCancel = () => {
    setGiftModalVisible(false);
    setSelectedItemForGift(null);
  };

  const handleBackToShop = () => {
    navigate('/shop');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {modalContextHolder}
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
              {t('item.backToShop')}
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
              {t('shop.empty.title')}
            </h2>
            <button
              onClick={handleBackToShop}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              style={{ fontFamily: 'SukhumvitSet' }}
            >
              {t('item.backToShop')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {modalContextHolder}
      
      {/* Header */}
      <div className="relative pt-20 pb-8">
        <div className="relative z-20 text-center px-4">
          <button
            onClick={handleBackToShop}
            className="absolute left-4 top-0 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
            style={{ fontFamily: 'SukhumvitSet' }}
          >
            {t('item.backToShop')}
          </button>
          <h1 className="text-4xl font-bold mb-4 text-white" style={{ fontFamily: 'SukhumvitSet' }}>
            {t('item.detailsTitle')}
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
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={handleBuyItem}
                        disabled={buyLoading}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'SukhumvitSet' }}
                      >
                        <ShoppingCartOutlined />
                        {buyLoading ? t('item.buttons.buying') : t('item.buttons.buy', { currency: t('common.currencySymbol'), price: item.price ? item.price.toLocaleString() : '0' })}
                      </button>
                      <button
                        onClick={handleGiftItem}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                        style={{ fontFamily: 'SukhumvitSet' }}
                      >
                        <GiftOutlined />
                        {t('item.buttons.gift')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => login()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                      style={{ fontFamily: 'SukhumvitSet' }}
                    >
                      <LoginOutlined />
                      {t('item.buttons.loginToBuy')}
                    </button>
                  )}
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
                        <span>⭐</span>{t('item.featured')}
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
                    {t('item.description')}
                  </h3>
                  <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'SukhumvitSet' }}>
                    {item.description || t('item.noDescription')}
                  </p>
                </div>

                {/* Item Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-1" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('item.category')}
                    </h4>
                    <p className="text-white font-medium text-sm" style={{ fontFamily: 'SukhumvitSet' }}>
                      {item.category?.category_name || item.category?.name || 'ไม่ระบุ'}
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-1" style={{ fontFamily: 'SukhumvitSet' }}>
                      {t('item.stockStatus')}
                    </h4>
                    <p className="text-white font-medium text-sm" style={{ fontFamily: 'SukhumvitSet' }}>
                      {(item.stock_quantity || item.stock) === -1 ? t('item.inStock') : t('item.stockLeft', { count: item.stock_quantity || item.stock })}
                    </p>
                  </div>
                </div>


                {/* Additional Info */}
                <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2" style={{ fontFamily: 'SukhumvitSet' }}>
                    {t('item.additionalInfo.header')}
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-1" style={{ fontFamily: 'SukhumvitSet' }}>
                    <li>• {t('item.additionalInfo.i1')}</li>
                    <li>• {t('item.additionalInfo.i2')}</li>
                    <li>• {t('item.additionalInfo.i3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>

      {/* Gift Modal */}
      <GiftModal
        visible={giftModalVisible}
        onCancel={handleGiftCancel}
        onConfirm={handleGiftConfirm}
        item={selectedItemForGift}
        loading={giftLoading}
      />
    </div>
  );
};

export default ItemDetails;