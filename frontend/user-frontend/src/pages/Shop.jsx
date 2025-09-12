import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import { useAuthContext } from '../contexts/AuthContext';
import { shopService } from '../services/shopService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import GiftModal from '../components/GiftModal';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { Sparkles } from '../components/ui/Sparkles';
import { message, Modal, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCartOutlined,
  GiftOutlined,
  StarOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  BugOutlined,
  DollarOutlined,
  ToolOutlined,
  CoffeeOutlined,
  LoginOutlined
} from '@ant-design/icons';

const Shop = () => {
  const navigate = useNavigate();
  const { categories, items, getItems, getCategories, loading, error } = useShop();
  const { isAuthenticated, login } = useAuthContext();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [selectedItemForGift, setSelectedItemForGift] = useState(null);
  const [giftLoading, setGiftLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const { t, i18n } = useTranslation();

  // Category icons for display mapping
  const categoryIcons = [
    <ExperimentOutlined />,
    <SafetyOutlined />,
    <BugOutlined />,
    <DollarOutlined />,
    <ToolOutlined />,
    <CoffeeOutlined />
  ];

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([getCategories(), getItems()]);
      } catch {
        // handled by hook error state
      }
    })();
  }, [getCategories, getItems]);
  // Refetch when language changes to get localized EN/TH data from API
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([getCategories(), getItems()]);
      } catch {
        // handled by hook error state
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  // Refetch when language changes to get localized EN/TH data from API
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([getCategories(), getItems()]);
      } catch {
        // handled by hook error state
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  // Categories and items from API
  const displayCategories = (categories || []).map((cat, idx) => ({
    id: cat.category_id || cat.id,
    name: cat.category_name || cat.name,
    icon: categoryIcons[idx % categoryIcons.length],
  }));
  const displayItems = items || [];

  const filteredItems = displayItems.filter(item => {
    const itemName = item.item_name || item.name;
    const itemCatId = item.category_id || item.category?.category_id || item.category?.id;
    const matchesCategory = !selectedCategory || itemCatId === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
      case 'legendary': return t('shop.rarity.legendary');
      case 'epic': return t('shop.rarity.epic');
      case 'rare': return t('shop.rarity.rare');
      default: return t('shop.rarity.common');
    }
  };

  const handleViewDetails = (itemId) => {
    navigate(`/shop/items/${itemId}`);
  };

  // Helper: show insufficient credits warning robustly
  const showInsufficientCredits = (desc) => {
    const run = () => {
      try {
        notification.warning({
          message: t('shop.errors.insufficientCreditsTitle'),
          description: t('shop.errors.insufficientCreditsDesc'),
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

  const handleBuyItem = async (item, e) => {
    e.stopPropagation();

    // Check if user is authenticated
    if (!isAuthenticated) {
      message.warning(t('shop.errors.loginRequiredBuy'));
      login();
      return;
    }

    const itemName = item.name || item.item_name;
    const priceText = typeof item.price === 'number' ? item.price.toLocaleString() : item.price;

    modal.confirm({
      title: t('shop.confirm.title'),
      content: t('shop.confirm.content', { item: itemName, currency: t('common.currencySymbol'), price: priceText }),
      okText: t('shop.confirm.ok'),
      cancelText: t('shop.confirm.cancel'),
      centered: true,
      onOk: async () => {
        try {
          setBuyLoading(true);

          // เรียก API ซื้อไอเทม
          const res = await shopService.buyItem(item.id || item.item_id);

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
                message: 'ซื้อไม่สำเร็จ',
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
            title: t('shop.purchase.successTitle'),
            content: t('shop.purchase.successModal', { item: itemName }),
          });
          notification.success({
            message: t('shop.purchase.successTitle'),
            description: t('shop.purchase.successDesc', { item: itemName }),
            placement: 'topRight',
          });
        } catch (error) {
          console.error('Buy item error:', error);

          // กรณีไม่ได้ล็อกอิน
          if (error.response?.status === 401) {
            message.error(t('shop.errors.loginRequiredBuy'));
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
              message: t('shop.errors.outOfStockTitle'),
              description: t('shop.errors.outOfStockDesc'),
              placement: 'topRight',
            });
          } else if (errorCode === 'ITEM_NOT_FOUND') {
            notification.error({
              message: t('shop.errors.notFoundTitle'),
              description: t('shop.errors.notFoundDesc'),
              placement: 'topRight',
            });
          } else {
            notification.error({
              message: t('shop.errors.genericTitle'),
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

  const handleGiftItem = (item, e) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      message.warning(t('shop.errors.loginRequiredGift'));
      login();
      return;
    }
    
    setSelectedItemForGift(item);
    setGiftModalVisible(true);
  };

  const handleGiftConfirm = async (recipientSteamId) => {
    try {
      setGiftLoading(true);
      const itemName = selectedItemForGift.name || selectedItemForGift.item_name;

      // Call the gift API and interpret 200 responses with success=false
      const res = await shopService.giftItem(
        selectedItemForGift.id || selectedItemForGift.item_id,
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

      message.success(`ส่งของขวัญ ${itemName} ให้ SteamID: ${recipientSteamId} สำเร็จ!`);
      setGiftModalVisible(false);
      setSelectedItemForGift(null);
    } catch (error) {
      console.error('Gift item error:', error);
      
      // Handle specific authentication errors
      if (error.response?.status === 401) {
        message.error('กรุณาเข้าสู่ระบบก่อนส่งของขวัญ');
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

  if (loading) {
    return (
      <div className="space-y-6">
        {modalContextHolder}
        <div className="relative z-20 pt-20">
          <Loading size="lg" message="Loading shop..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {modalContextHolder}
      
      {/* ServerHero Style Header */}
      <>
        {/* Text header */}
        <div className="relative pt-20 pb-8">
          <div className="relative z-20 text-center px-4">
            <h1 className="text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'SukhumvitSet' }}>
              {t('shop.title')}
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'SukhumvitSet' }}>
              {t('shop.subtitle')}
            </p>
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
      </>

      {/* Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 max-w-6xl py-8">
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-red-300" style={{ fontFamily: 'SukhumvitSet' }}>{error}</p>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('shop.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontFamily: 'SukhumvitSet' }}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  !selectedCategory
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                }`}
                style={{ fontFamily: 'SukhumvitSet' }}
              >
                {t('shop.allCategories')}
              </button>
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white backdrop-blur-sm'
                  }`}
                  style={{ fontFamily: 'SukhumvitSet' }}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredItems.map((item) => (
              <div
                key={item.id || item.item_id}
                className={`relative group bg-zinc-900/60 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:bg-zinc-900/80 cursor-pointer flex flex-col h-full ${
                  item.featured || item.is_featured ? 'border-blue-500/50 hover:border-blue-500' : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => handleViewDetails(item.id || item.item_id)}
              >
                {/* Featured Badge */}
                {(item.featured || item.is_featured) && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1" style={{ fontFamily: 'SukhumvitSet' }}>
                      <StarOutlined /> {t('shop.featured')}
                    </div>
                  </div>
                )}

                {/* Rarity Badge */}
                <div className="absolute top-2 right-2 z-10">
                  <div className={`${getRarityColor(item.rarity)} text-white text-xs font-bold px-2 py-1 rounded-full`} style={{ fontFamily: 'SukhumvitSet' }}>
                    {getRarityText(item.rarity)}
                  </div>
                </div>

                <div className="aspect-w-1 aspect-h-1 mb-4 mt-8">
                  <img
                    src={item.image_url || item.imageUrl}
                    alt={item.name || item.item_name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="flex-grow space-y-3">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'SukhumvitSet' }}>
                      {item.name || item.item_name}
                    </h3>
                    <p className="text-sm text-gray-300 line-clamp-2" style={{ fontFamily: 'SukhumvitSet' }}>
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-400" style={{ fontFamily: 'SukhumvitSet' }}>
                        {t('common.currencySymbol')}{item.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400" style={{ fontFamily: 'SukhumvitSet' }}>
                        {t('shop.left', { count: item.stock || item.stock_quantity })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-400 bg-blue-600/20 px-2 py-1 rounded-full" style={{ fontFamily: 'SukhumvitSet' }}>
                        {item.category?.category_name || item.category?.name}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - Always at bottom */}
                  <div className="flex gap-2 mt-4 pt-4">
                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={(e) => handleBuyItem(item, e)}
                          disabled={buyLoading}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: 'SukhumvitSet' }}
                        >
                          <ShoppingCartOutlined />
                          {buyLoading ? t('shop.buttons.buying') : t('shop.buttons.buy')}
                        </button>
                        <button
                          onClick={(e) => handleGiftItem(item, e)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 backdrop-blur-sm"
                          style={{ fontFamily: 'SukhumvitSet' }}
                        >
                          <GiftOutlined />
                          {t('shop.buttons.gift')}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          login();
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 backdrop-blur-sm"
                        style={{ fontFamily: 'SukhumvitSet' }}
                      >
                        <LoginOutlined />
                        {t('shop.loginToBuy')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-medium text-white mb-2" style={{ fontFamily: 'SukhumvitSet' }}>
                {t('shop.empty.title')}
              </h3>
              <p className="text-gray-400" style={{ fontFamily: 'SukhumvitSet' }}>
                {t('shop.empty.subtitle')}
              </p>
            </div>
          )}

          {/* Shop Info */}
          <div className="bg-blue-900/30 border border-blue-500/30 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white" style={{ fontFamily: 'SukhumvitSet' }}>{t('shop.tips.header')}</h3>
            </div>
            <ul className="text-sm text-gray-300 space-y-2" style={{ fontFamily: 'SukhumvitSet' }}>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                {t('shop.tips.t1')}
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                {t('shop.tips.t2')}
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                {t('shop.tips.t3')}
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                {t('shop.tips.t4')}
              </li>
            </ul>
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

export default Shop;