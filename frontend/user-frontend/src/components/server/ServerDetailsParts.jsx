import React from 'react';
import { Typography, Row, Col, List, Space, Button } from 'antd';
import { WarningOutlined, BarChartOutlined } from '@ant-design/icons';
import { Navigation } from '../ui/Navigation';
import { SpotlightCard } from '../ui/SpotlightCard';
import { GridPattern } from '../ui/GridPattern';
import { Sparkles } from '../ui/Sparkles';

const { Title, Text, Paragraph } = Typography;

/**
 * ServerHero
 * Encapsulates the header title, description and sparkles background band.
 */
export const ServerHero = ({ title = 'Setting NEXArk x25' }) => {
  return (
    <>
      {/* Text header */}
      <div className="relative pt-20 pb-8">
        <div className="relative z-20 text-center px-4">
          <Title level={1} style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>
            {title}
          </Title>
          <Paragraph style={{ color: '#d1d5db', fontSize: '1.25rem', maxWidth: '672px', margin: '0 auto' }}>
            เซิฟเวอร์ NEXArk x25 ที่มาพร้อมกับการปรับแต่งและตั้งค่าพิเศษมากมาย
          </Paragraph>
          <Paragraph strong style={{ color: '#d1d5db', fontSize: '1.25rem', marginTop: '0.5rem' }}>
            รายละเอียดการตั้งค่าทั้งหมดสำหรับการเล่นที่สมบูรณ์แบบ
          </Paragraph>
        </div>
      </div>

      {/* Background band with sparkles - positioned below text and above navigation */}
      <div className="relative mb-8">
        <div className="relative h-32 overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#7876c566] after:bg-zinc-900">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage:
                "url('https://cdn.discordapp.com/attachments/820713052684419082/1002956012493471884/Server_Banner.png')",
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
  );
};

/**
 * ServerTabs
 * Renders the rounded Navigation tabs bar.
 */
export const ServerTabs = ({ menuItems, setActiveTab, activeTab }) => {
  const activeIndex = menuItems.findIndex(item => item.key === activeTab);
  
  return (
    <div className="flex justify-center mb-8">
      <div className="mx-auto shrink-0 overflow-hidden rounded-full">
        <Navigation
          as="nav"
          className="relative rounded-full border border-white/10 bg-white/5 p-2"
          duration={500}
          fluid
          defaultIndex={activeIndex >= 0 ? activeIndex : 0}
        >
          {({ ready, size, position, duration }) => (
            <div
              style={{
                '--size': size,
                '--position': position,
                '--duration': duration,
              }}
            >
              <div
                className={`${ready ? '' : 'hidden'} absolute bottom-0 h-1/2 w-[var(--size)] translate-x-[var(--position)] bg-white/75 blur-xl transition-[width,transform] duration-[--duration]`}
              />
              <div className="absolute inset-0 rounded-full bg-zinc-800"></div>

              <div className="relative">
                <div
                  className={`${ready ? '' : 'hidden'} absolute inset-y-0 h-full w-[var(--size)] translate-x-[var(--position)] rounded-full bg-white/10 transition-[width,transform] duration-[--duration]`}
                />
                <div
                  className={`${ready ? '' : 'hidden'} absolute bottom-0 h-1/3 w-[var(--size)] translate-x-[var(--position)] rounded-full bg-white opacity-20 blur-md transition-[width,transform] duration-[--duration]`}
                />

                <Navigation.List as="ul" className="relative flex items-center gap-3">
                  {menuItems.map((item, index) => (
                    <Navigation.Item
                      key={index}
                      as="li"
                      active={activeTab === item.key}
                      onActivated={() => setActiveTab(item.key)}
                    >
                      {({ setActive, isActive }) => (
                        <button
                          onClick={() => {
                            setActive();
                            setActiveTab(item.key);
                          }}
                          className={`${
                            isActive ? 'text-white/75 text-shadow-sm' : 'text-white/60 hover:text-white/75'
                          } inline-flex items-center gap-2 px-4 py-1.5 text-sm font-light transition-[text-shadow,color] duration-300`}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      )}
                    </Navigation.Item>
                  ))}
                </Navigation.List>
              </div>
            </div>
          )}
        </Navigation>
      </div>
    </div>
  );
};

/**
 * ServerSectionContent
 * Spotlight card and per-tab content renderer.
 */
export const ServerSectionContent = ({ activeTab, displayInfos, menuItems }) => {
  const data = displayInfos?.[activeTab];

  if (!data) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-8 text-center">
        <BarChartOutlined className="text-gray-400 text-3xl mb-2 block" />
        <p className="text-gray-300 text-lg">Loading {menuItems.find((c) => c.key === activeTab)?.label}...</p>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-xl p-8 text-center">
        <WarningOutlined className="text-red-400 text-3xl mb-2 block" />
        <p className="text-red-300 text-lg">Failed to load {menuItems.find((c) => c.key === activeTab)?.label}</p>
        <p className="text-red-400 text-sm mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <SpotlightCard
      from="#1cd1c6"
      via="#407cff"
      size={300}
      className="mx-auto w-full max-w-full rounded-[--radius] bg-white/10 p-8 [--radius:theme(borderRadius.2xl)]"
    >
      <div className="absolute inset-px rounded-[calc(var(--radius)-1px)] bg-zinc-800"></div>

      <GridPattern
        size={64}
        offsetX={0}
        offsetY={0}
        className="absolute -top-1/2 right-0 h-[200%] w-2/3 skew-y-12 stroke-white/10 stroke-[2] [mask-image:linear-gradient(-85deg,black,transparent)]"
      >
        {[
          [2, 5],
          [3, 1],
          [4, 3],
        ].map(([row, column], index) => (
          <GridPattern.Block key={index} row={row} column={column} className="fill-white/2.5 transition duration-500 hover:fill-white/5" />
        ))}
      </GridPattern>

      <div className="relative z-10">
        {activeTab === 'settings' ? (
          <Row gutter={[24, 24]}>
            {Array.isArray(data) &&
              data.map((config, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <div style={{ padding: '16px 20px', minHeight: '120px' }}>
                    <div>
                      <Title level={5} style={{ color: 'white', marginBottom: '4px' }}>
                        {config.title}
                      </Title>
                      {config.subtitle && <Text style={{ color: '#9ca3af', fontSize: '12px' }}>{config.subtitle}</Text>}
                    </div>

                    {config.value && (
                      <Text style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold' }}>{config.value}</Text>
                    )}

                    {config.extra && (
                      <Text italic style={{ color: '#d1d5db', fontSize: '14px' }}>
                        {config.extra}
                      </Text>
                    )}

                    {config.items && (
                      <List
                        size="small"
                        dataSource={config.items}
                        renderItem={(item) => (
                          <List.Item style={{ padding: '4px 0', border: 'none' }}>
                            <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '6px',
                                  height: '6px',
                                  backgroundColor: '#3b82f6',
                                  borderRadius: '50%',
                                  marginRight: '8px',
                                }}
                              ></span>
                              {item}
                            </Text>
                          </List.Item>
                        )}
                      />
                    )}
                  </div>
                </Col>
              ))}
          </Row>
        ) : activeTab === 'structures' ? (
          <Row gutter={[32, 32]}>
            {Array.isArray(data) &&
              data.map((config, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <div style={{ padding: '16px', height: '100%' }}>
                    <div>
                      <Title level={5} style={{ color: 'white', marginBottom: '4px' }}>
                        {config.title}
                      </Title>
                      {config.subtitle && <Text style={{ color: '#9ca3af', fontSize: '12px' }}>{config.subtitle}</Text>}
                    </div>

                    {config.value && (
                      <Text style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold' }}>{config.value}</Text>
                    )}

                    {config.items && (
                      <List
                        size="small"
                        dataSource={config.items}
                        renderItem={(item) => (
                          <List.Item style={{ padding: '2px 0', border: 'none' }}>
                            <Text style={{ color: '#d1d5db', fontSize: '14px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '6px',
                                  height: '6px',
                                  backgroundColor: '#3b82f6',
                                  borderRadius: '50%',
                                  marginRight: '8px',
                                }}
                              ></span>
                              {item}
                            </Text>
                          </List.Item>
                        )}
                      />
                    )}
                  </div>
                </Col>
              ))}
          </Row>
        ) : activeTab === 'dinos' ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[32, 32]}>
              {data &&
                Object.entries(data).map(([key, category], index) => (
                  <Col xs={24} lg={12} key={index}>
                    <div
                      style={{
                        padding: '24px',
                        height: '100%',
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <Title level={4} style={{ color: 'white', margin: 0, marginBottom: '8px' }}>
                            {category.title}
                          </Title>
                          <Text style={{ color: '#9ca3af', fontSize: '14px' }}>{category.subtitle}</Text>
                        </div>

                        {category.items && (
                          <List
                            size="small"
                            dataSource={category.items}
                            renderItem={(item) => (
                              <List.Item style={{ padding: '4px 0', border: 'none' }}>
                                <Text style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.4' }}>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      width: '4px',
                                      height: '4px',
                                      backgroundColor:
                                        key === 'defaultSettings'
                                          ? '#3b82f6'
                                          : key === 'bossContent'
                                          ? '#ef4444'
                                          : key === 'buffNerf'
                                          ? '#10b981'
                                          : key === 'removedDinos'
                                          ? '#ef4444'
                                          : '#8b5cf6',
                                      borderRadius: '50%',
                                      marginRight: '8px',
                                      marginTop: '6px',
                                      flexShrink: 0,
                                    }}
                                  ></span>
                                  {item}
                                </Text>
                              </List.Item>
                            )}
                          />
                        )}
                      </Space>
                    </div>
                  </Col>
                ))}
            </Row>
          </Space>
        ) : activeTab === 'items' ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[32, 32]}>
              {data &&
                Object.entries(data).map(([key, category], index) => (
                  <Col xs={24} md={12} lg={8} key={index}>
                    <div
                      style={{
                        padding: '20px',
                        height: '100%',
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <Title level={4} style={{ color: 'white', margin: 0, marginBottom: '8px' }}>
                            {category.title}
                          </Title>
                          <Text style={{ color: '#9ca3af', fontSize: '14px' }}>{category.subtitle}</Text>
                        </div>

                        {category.items && (
                          <List
                            size="small"
                            dataSource={category.items}
                            renderItem={(item) => (
                              <List.Item style={{ padding: '3px 0', border: 'none' }}>
                                <Text style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.4' }}>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      width: '4px',
                                      height: '4px',
                                      backgroundColor:
                                        key === 'weapons'
                                          ? '#3b82f6'
                                          : key === 'armor'
                                          ? '#10b981'
                                          : key === 'shields'
                                          ? '#f59e0b'
                                          : key === 'customCrafting'
                                          ? '#8b5cf6'
                                          : '#ef4444',
                                      borderRadius: '50%',
                                      marginRight: '8px',
                                      marginTop: '6px',
                                      flexShrink: 0,
                                    }}
                                  ></span>
                                  {item}
                                </Text>
                              </List.Item>
                            )}
                          />
                        )}
                      </Space>
                    </div>
                  </Col>
                ))}
            </Row>
          </Space>
        ) : activeTab === 'environment' ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[24, 24]}>
              {Array.isArray(data) &&
                data.map((config, index) => (
                  <Col xs={24} md={12} lg={8} key={index}>
                    <div
                      style={{
                        padding: '20px',
                        height: '100%',
                        border: index === 0 ? '2px solid #3b82f6' : '1px solid #374151',
                        borderRadius: '12px',
                        backgroundColor: index === 0 ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <Title
                            level={4}
                            style={{
                              color: index === 0 ? '#3b82f6' : 'white',
                              margin: 0,
                              marginBottom: '8px',
                              textAlign: index === 0 ? 'center' : 'left',
                            }}
                          >
                            {config.title}
                          </Title>
                          <Text
                            style={{
                              color: '#9ca3af',
                              fontSize: '14px',
                              display: 'block',
                              textAlign: index === 0 ? 'center' : 'left',
                            }}
                          >
                            {config.subtitle}
                          </Text>
                        </div>

                        {config.value && (
                          <Text style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold' }}>{config.value}</Text>
                        )}

                        {config.items && (
                          <List
                            size="small"
                            dataSource={config.items}
                            renderItem={(item) => (
                              <List.Item style={{ padding: '4px 0', border: 'none' }}>
                                <Text
                                  style={{
                                    color: '#d1d5db',
                                    fontSize: index === 0 ? '13px' : '14px',
                                    lineHeight: '1.5',
                                    fontFamily: index === 0 ? 'inherit' : 'monospace',
                                  }}
                                >
                                  {item}
                                </Text>
                              </List.Item>
                            )}
                          />
                        )}
                      </Space>
                    </div>
                  </Col>
                ))}
            </Row>
          </Space>
        ) : activeTab === 'commands' ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[24, 24]}>
              {Array.isArray(data) &&
                data.map((category, index) => (
                  <Col xs={24} md={12} lg={8} key={index}>
                    <div
                      style={{
                        padding: '20px',
                        height: '100%',
                        border: category.special ? '2px solid #f59e0b' : '1px solid #374151',
                        borderRadius: '12px',
                        backgroundColor: category.special ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <Title level={4} style={{ color: category.special ? '#f59e0b' : 'white', margin: 0, marginBottom: '8px' }}>
                            {category.title}
                          </Title>
                          <Text style={{ color: '#9ca3af', fontSize: '14px' }}>{category.subtitle}</Text>
                        </div>

                        {category.commands && (
                          <List
                            size="small"
                            dataSource={category.commands}
                            renderItem={(command) => (
                              <List.Item style={{ padding: '6px 0', border: 'none', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div style={{ width: '100%' }}>
                                  <Text
                                    code
                                    style={{
                                      color: '#10b981',
                                      fontSize: '14px',
                                      backgroundColor: 'rgba(16,185,129,0.1)',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {command.cmd}
                                  </Text>
                                </div>
                                <Text style={{ color: '#d1d5db', fontSize: '13px', marginTop: '4px', lineHeight: '1.4' }}>{command.desc}</Text>
                              </List.Item>
                            )}
                          />
                        )}
                      </Space>
                    </div>
                  </Col>
                ))}
            </Row>
          </Space>
        ) : activeTab === 'rules' ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[24, 24]}>
              {Array.isArray(data) &&
                data.map((section, index) => (
                  <Col xs={24} lg={12} key={index}>
                    <div
                      style={{
                        padding: '24px',
                        height: '100%',
                        border: index === 0 ? '2px solid #10b981' : '1px solid #374151',
                        borderRadius: '12px',
                        backgroundColor: index === 0 ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <Title level={4} style={{ color: index === 0 ? '#10b981' : 'white', margin: 0, marginBottom: '8px' }}>
                            {section.title}
                          </Title>
                          <Text style={{ color: '#9ca3af', fontSize: '14px' }}>{section.subtitle}</Text>
                        </div>

                        {section.items && (
                          <List
                            size="small"
                            dataSource={section.items}
                            renderItem={(item) => (
                              <List.Item style={{ padding: '6px 0', border: 'none', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Text style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.6', textAlign: 'left', width: '100%' }}>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      width: '4px',
                                      height: '4px',
                                      backgroundColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#ef4444',
                                      borderRadius: '50%',
                                      marginRight: '8px',
                                      marginTop: '8px',
                                      flexShrink: 0,
                                    }}
                                  ></span>
                                  {item}
                                </Text>
                              </List.Item>
                            )}
                          />
                        )}
                      </Space>
                    </div>
                  </Col>
                ))}
            </Row>
          </Space>
        ) : (
          <Row gutter={[24, 24]}>
            {data &&
              Object.entries(data).map(([key, value]) => (
                <Col xs={24} sm={12} md={8} lg={6} key={key}>
                  <div style={{ padding: '16px 20px', minHeight: '120px' }}>
                    <div>
                      <Title level={5} style={{ color: 'white', textTransform: 'capitalize', marginBottom: '4px' }}>
                        {key.replace(/_/g, ' ')}
                      </Title>
                      <Text style={{ color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Configuration Value</Text>
                    </div>
                    <Text style={{ color: '#d1d5db', fontSize: '16px' }}>{String(value)}</Text>
                  </div>
                </Col>
              ))}
          </Row>
        )}
      </div>
    </SpotlightCard>
  );
};