import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Hash, Volume2, Settings, Mic, Headphones, Plus, 
  Search, Bell, Pin, Users, HelpCircle, Inbox, 
  Gift, Sticker, Smile, MoreVertical, Phone, Video, UserPlus, X,
  LogOut, Shield, Monitor, MessageSquare, ChevronDown, ChevronRight, 
  Edit2, Trash2, Reply, Check, MicOff, PhoneOff,
  MonitorUp, VideoOff, Activity, Palette, Mail, Download,
  Globe, Keyboard, Laptop, Copy, Upload, ArrowUp, ArrowDown, Image as ImageIcon
} from 'lucide-react';

// --- Constants & Utils ---
const COLORS = {
  bgPrimary: '#36393f',
  bgSecondary: '#2f3136',
  bgTertiary: '#202225',
  bgFloating: '#18191c',
  accent: '#5865F2',
  green: '#3ba55c',
  red: '#ed4245',
  yellow: '#faa61a'
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (isToday) return `Today at ${time}`;
  if (isYesterday) return `Yesterday at ${time}`;
  return date.toLocaleDateString() + ` ${time}`;
};

// --- Initial Mock Data ---
const INITIAL_DATA = {
  user: {
    id: 'u1',
    username: 'DemoUser',
    discriminator: '1234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    status: 'online',
    color: '#5865F2',
    bannerColor: '#5865F2',
    about: 'Building the future, one div at a time.',
    micMuted: false,
    soundMuted: false
  },
  servers: [
    { 
      id: 's1', 
      name: 'React Developers', 
      icon: 'https://api.dicebear.com/7.x/initials/svg?seed=RD&backgroundColor=5865F2',
      roles: [
        { id: 'r1', name: 'Maintainer', color: '#e91e63' },
        { id: 'r2', name: 'Senior Dev', color: '#f1c40f' },
        { id: 'r3', name: 'Member', color: '#b9bbbe' }
      ]
    },
    { 
      id: 's2', 
      name: 'Gaming Lounge', 
      icon: 'https://api.dicebear.com/7.x/initials/svg?seed=GL&backgroundColor=3ba55c',
      roles: [
        { id: 'r4', name: 'Admin', color: '#ed4245' },
        { id: 'r5', name: 'Gamer', color: '#9b59b6' }
      ]
    },
  ],
  channels: {
    's1': [
      { id: 'c1', name: 'general', type: 'text', category: 'Information' },
      { id: 'c2', name: 'announcements', type: 'text', category: 'Information' },
      { id: 'c3', name: 'help-react', type: 'text', category: 'Development' },
      { id: 'vc1', name: 'General Voice', type: 'voice', category: 'Voice Channels' },
    ],
    's2': [
      { id: 'c5', name: 'lfg-ranked', type: 'text', category: 'Gaming' },
      { id: 'vc3', name: 'Lobby', type: 'voice', category: 'Voice Channels' },
    ],
  },
  messages: {
    'c1': [
      { id: 'm1', authorId: 'u2', content: 'Welcome to the React Developers server! @DemoUser feel free to ask questions.', timestamp: new Date(Date.now() - 86400000).toISOString(), reactions: {'👋': 5} },
      { id: 'm2', authorId: 'u3', content: 'Hey everyone, glad to be here.', timestamp: new Date(Date.now() - 86000000).toISOString(), reactions: {} },
    ]
  },
  members: {
    's1': [
      { id: 'u2', username: 'DanTheMan', discriminator: '0001', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dan', status: 'online', roleId: 'r1', color: '#e91e63', activity: 'Visual Studio Code' },
      { id: 'u3', username: 'JuniorDev', discriminator: '9999', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Junior', status: 'idle', roleId: 'r3', color: '#b9bbbe', activity: null },
      { id: 'u1', username: 'DemoUser', discriminator: '1234', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', status: 'online', roleId: 'r3', color: '#5865F2', activity: null }
    ]
  },
  dms: [
    { id: 'dm1', recipientId: 'f1', lastMessage: 'Did you see the new update?', timestamp: new Date().toISOString() }
  ],
  friends: [
    { id: 'f1', username: 'Wumpus', discriminator: '0000', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Wumpus', status: 'online', activity: 'Playing Discord' },
    { id: 'f2', username: 'Nelly', discriminator: '1337', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nelly', status: 'idle', activity: 'Listening to Lo-Fi' },
  ],
  emojis: ['😀', '😂', '🥰', '😎', '🤔', '👍', '👎', '🔥', '✨', '🎉', '🚀', '👀']
};

// --- Shared Components ---

const Tooltip = ({ text, children, side = 'right' }) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <div className={`
      absolute z-50 hidden whitespace-nowrap rounded bg-black px-2.5 py-1.5 text-xs font-bold text-white shadow-lg group-hover:block animate-in fade-in zoom-in-95 duration-75
      ${side === 'right' ? 'left-full ml-2' : 'bottom-full mb-2'}
    `}>
      {text}
      {side === 'right' && <div className="absolute left-0 top-1/2 -ml-1 -mt-1 h-2 w-2 -rotate-45 bg-black"></div>}
      {side === 'top' && <div className="absolute bottom-0 left-1/2 -mb-1 -ml-1 h-2 w-2 rotate-45 bg-black"></div>}
    </div>
  </div>
);

const UserAvatar = ({ user, size = 'md', showStatus = true }) => {
  const sizeClasses = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-20 h-20', xl: 'w-24 h-24', xxl: 'w-32 h-32' };
  const statusColors = { online: 'bg-green-500', idle: 'bg-yellow-500', dnd: 'bg-red-500', offline: 'bg-gray-500' };
  
  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-[#202225]`}>
        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
      </div>
      {showStatus && (
        <div className={`absolute bottom-0 right-0 rounded-full border-[3px] border-[#2f3136] ${statusColors[user.status]} 
          ${size === 'lg' || size === 'xl' || size === 'xxl' ? 'w-6 h-6 border-4' : 'w-3.5 h-3.5'}`} 
        />
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState(INITIAL_DATA.user);
  const [activeServerId, setActiveServerId] = useState('home');
  const [activeChannelId, setActiveChannelId] = useState(null);
  
  // Data State
  const [servers, setServers] = useState(INITIAL_DATA.servers);
  const [channels, setChannels] = useState(INITIAL_DATA.channels);
  const [messages, setMessages] = useState(INITIAL_DATA.messages);
  const [dms, setDms] = useState(INITIAL_DATA.dms);
  const [friends, setFriends] = useState(INITIAL_DATA.friends);
  
  // UI State
  const [voiceState, setVoiceState] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [membersSidebarOpen, setMembersSidebarOpen] = useState(true);
  const [serverDropdownOpen, setServerDropdownOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'userSettings', 'serverSettings', 'createChannel', 'userProfile', 'channelSettings'
  const [modalData, setModalData] = useState(null);

  const messagesEndRef = useRef(null);

  // Derived Data
  const activeServer = servers.find(s => s.id === activeServerId);
  const currentChannels = channels[activeServerId] || [];
  
  const currentChannel = activeServerId === 'home'
    ? dms.find(dm => dm.id === activeChannelId)
    : currentChannels.find(c => c.id === activeChannelId);
    
  const currentChannelName = activeServerId === 'home' 
    ? friends.find(f => f.id === currentChannel?.recipientId)?.username 
    : currentChannel?.name;

  const currentChannelMessages = messages[activeChannelId] || [];

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [currentChannelMessages.length, activeChannelId]);

  // Handlers
  const handleServerSwitch = (serverId) => {
    setActiveServerId(serverId);
    setServerDropdownOpen(false);
    if (serverId !== 'home') {
      const firstChannel = channels[serverId]?.find(c => c.type === 'text');
      if (firstChannel) setActiveChannelId(firstChannel.id);
    } else {
      setActiveChannelId(null);
    }
  };

  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputMessage.trim()) {
      e.preventDefault();
      const newMessage = {
        id: generateId(),
        authorId: currentUser.id,
        content: inputMessage,
        timestamp: new Date().toISOString(),
        reactions: {}
      };
      setMessages(prev => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), newMessage]
      }));
      setInputMessage('');
      setEmojiPickerOpen(false);
    }
  };

  const handleStartDM = (userId) => {
    // Check if DM exists
    let existingDM = dms.find(d => d.recipientId === userId);
    if (!existingDM) {
        // Check if friend exists, if not add to friends temporarily for demo
        let friend = friends.find(f => f.id === userId);
        if (!friend) {
            // In a real app we would fetch user data, here we mock based on click
            const targetMember = Object.values(INITIAL_DATA.members).flat().find(m => m.id === userId);
            if (targetMember) {
                friend = { ...targetMember }; // Treat member as friend for DM context
                setFriends(prev => [...prev, friend]);
            }
        }
        
        const newDM = { id: generateId(), recipientId: userId, lastMessage: '', timestamp: new Date().toISOString() };
        setDms(prev => [newDM, ...prev]);
        existingDM = newDM;
    }
    
    setActiveServerId('home');
    setActiveChannelId(existingDM.id);
    setActiveModal(null); // Close profile if open
  };

  const handleAvatarUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const imageUrl = URL.createObjectURL(file);
          setCurrentUser(prev => ({ ...prev, avatar: imageUrl }));
      }
  };

  const handleChannelReorder = (channelId, direction) => {
      const serverChannels = [...channels[activeServerId]];
      const index = serverChannels.findIndex(c => c.id === channelId);
      if (index < 0) return;

      if (direction === 'up' && index > 0) {
          [serverChannels[index], serverChannels[index - 1]] = [serverChannels[index - 1], serverChannels[index]];
      } else if (direction === 'down' && index < serverChannels.length - 1) {
          [serverChannels[index], serverChannels[index + 1]] = [serverChannels[index + 1], serverChannels[index]];
      }
      
      setChannels(prev => ({ ...prev, [activeServerId]: serverChannels }));
  };

  // --- Render Helpers ---
  
  const renderMessageContent = (content) => {
      // Tag highlighting logic
      const parts = content.split(/(@\w+)/g);
      return parts.map((part, i) => {
          if (part.match(/@\w+/)) {
              return <span key={i} className="bg-[#5865F2] bg-opacity-30 text-[#aeb4f8] px-0.5 rounded hover:underline cursor-pointer font-medium">{part}</span>;
          }
          return part;
      });
  };

  // --- Sub-Components ---

  const ServerIcon = ({ server, isHome, isAdd }) => {
    const isActive = activeServerId === (server?.id || (isHome ? 'home' : ''));
    
    if (isAdd) return (
      <div className="group relative flex items-center justify-center py-1 w-full cursor-pointer">
        <div className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#36393f] text-[#3ba55c] transition-all duration-200 group-hover:rounded-[16px] group-hover:bg-[#3ba55c] group-hover:text-white">
          <Plus size={24} />
        </div>
      </div>
    );

    return (
      <Tooltip text={isHome ? "Direct Messages" : server.name}>
        <div 
          className="group relative flex items-center justify-center py-1 w-full cursor-pointer"
          onClick={() => handleServerSwitch(isHome ? 'home' : server.id)}
        >
          <div className={`absolute left-0 w-1 rounded-r-xl bg-white transition-all duration-200 
            ${isActive ? 'h-10' : 'h-2 scale-0 group-hover:scale-100'}`} 
          />
          <div className={`
            relative flex h-12 w-12 items-center justify-center overflow-hidden transition-all duration-200
            ${isActive || isHome ? 'rounded-[16px]' : 'rounded-[24px] group-hover:rounded-[16px]'}
            ${isActive ? 'bg-[#5865F2]' : 'bg-[#36393f] group-hover:bg-[#5865F2]'}
          `}>
            {isHome ? (
              <img src="https://assets-global.website-files.com/6257adef93867e56f84d310d/636e0a6ca49cf572487fa7b1_Discord-icon-bottom.png" alt="Home" className="h-7 w-7 object-contain" />
            ) : server.icon ? (
              <img src={server.icon} alt={server.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-medium text-[#dcddde] group-hover:text-white">
                {server.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </Tooltip>
    );
  };

  // --- Modals ---

  const UserSettingsModal = () => {
     const [tab, setTab] = useState('My Account');
     return (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-80 animate-in fade-in">
            <div className="flex w-full h-full max-w-5xl mx-auto">
                <div className="w-[220px] bg-[#2f3136] flex flex-col items-end pt-14 pr-2">
                    <div className="text-xs font-bold text-[#96989d] uppercase px-2.5 mb-2">User Settings</div>
                    {['My Account', 'Profile', 'Privacy', 'Authorized Apps'].map(t => (
                        <div key={t} onClick={() => setTab(t)} className={`px-2.5 py-1.5 mb-0.5 rounded cursor-pointer text-sm w-48 ${tab === t ? 'bg-[#40444b] text-white' : 'text-[#b9bbbe] hover:bg-[#36393f] hover:text-[#dcddde]'}`}>
                            {t}
                        </div>
                    ))}
                    <div className="w-48 h-[1px] bg-[#40444b] my-2"></div>
                    <div className="px-2.5 py-1.5 rounded cursor-pointer text-sm w-48 text-[#ed4245] hover:bg-[#36393f] flex items-center">
                        <LogOut size={16} className="mr-2"/> Log Out
                    </div>
                </div>
                <div className="flex-1 bg-[#36393f] pt-14 px-10 relative">
                    <h2 className="text-xl font-bold text-white mb-6">{tab}</h2>
                    {tab === 'My Account' && (
                        <div className="bg-[#202225] rounded-lg p-4 overflow-hidden relative">
                             <div className="h-24 w-full absolute top-0 left-0" style={{backgroundColor: currentUser.bannerColor}}></div>
                             <div className="relative mt-14 flex items-end justify-between px-4">
                                 <div className="flex items-end group relative">
                                     <div className="w-24 h-24 rounded-full border-4 border-[#202225] relative z-10 bg-[#202225] cursor-pointer overflow-hidden group-hover:opacity-90">
                                        <img src={currentUser.avatar} className="w-full h-full object-cover"/>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="text-xs text-white font-bold uppercase text-center">Change<br/>Avatar</div>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" title="Change Avatar" />
                                     </div>
                                     <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#202225] z-20"></div>
                                     <div className="mb-2 ml-3">
                                         <div className="text-white font-bold text-xl">{currentUser.username}<span className="text-[#b9bbbe]">#{currentUser.discriminator}</span></div>
                                     </div>
                                 </div>
                                 <button className="bg-[#5865F2] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#4752c4]">Edit Profile</button>
                             </div>
                             <div className="bg-[#2f3136] rounded m-4 p-4 space-y-4">
                                 <div className="flex justify-between">
                                     <div><div className="text-xs font-bold text-[#b9bbbe] uppercase">Username</div><div className="text-white text-sm">{currentUser.username}</div></div>
                                     <button className="bg-[#4f545c] text-white px-3 py-1 rounded text-xs hover:bg-[#5d6269]">Edit</button>
                                 </div>
                                 <div className="flex justify-between">
                                     <div><div className="text-xs font-bold text-[#b9bbbe] uppercase">Email</div><div className="text-white text-sm">demo@example.com <span className="text-[#ed4245] text-xs ml-1">(Hidden)</span></div></div>
                                     <button className="bg-[#4f545c] text-white px-3 py-1 rounded text-xs hover:bg-[#5d6269]">Edit</button>
                                 </div>
                             </div>
                        </div>
                    )}
                    <div className="absolute top-14 right-10 flex flex-col items-center cursor-pointer text-[#b9bbbe] hover:text-white" onClick={() => setActiveModal(null)}>
                        <div className="border-2 border-current rounded-full p-1 mb-1"><X size={16}/></div>
                        <span className="text-xs font-bold">ESC</span>
                    </div>
                </div>
            </div>
        </div>
     );
  };

  const ServerSettingsModal = () => {
      const [serverName, setServerName] = useState(activeServer?.name);
      return (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-80 animate-in fade-in">
            <div className="flex w-full h-full max-w-5xl mx-auto">
                <div className="w-[220px] bg-[#2f3136] flex flex-col items-end pt-14 pr-2">
                     <div className="text-xs font-bold text-[#96989d] uppercase px-2.5 mb-2">{activeServer?.name}</div>
                    {['Overview', 'Roles', 'Emoji', 'Stickers', 'Members'].map(t => (
                        <div key={t} className={`px-2.5 py-1.5 mb-0.5 rounded cursor-pointer text-sm w-48 ${t === 'Overview' ? 'bg-[#40444b] text-white' : 'text-[#b9bbbe] hover:bg-[#36393f] hover:text-[#dcddde]'}`}>{t}</div>
                    ))}
                    <div className="w-48 h-[1px] bg-[#40444b] my-2"></div>
                    <div className="px-2.5 py-1.5 rounded cursor-pointer text-sm w-48 text-[#ed4245] hover:bg-[#36393f]">Delete Server</div>
                </div>
                <div className="flex-1 bg-[#36393f] pt-14 px-10 relative">
                     <h2 className="text-xl font-bold text-white mb-6">Server Overview</h2>
                     <div className="flex space-x-8">
                         <div className="flex justify-center">
                             <div className="w-24 h-24 rounded-full bg-[#202225] relative group cursor-pointer">
                                <img src={activeServer?.icon} className="w-full h-full rounded-full object-cover"/>
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs text-white font-bold rounded-full">CHANGE<br/>ICON</div>
                             </div>
                         </div>
                         <div className="flex-1 max-w-md">
                             <label className="text-xs font-bold text-[#b9bbbe] uppercase mb-2 block">Server Name</label>
                             <input value={serverName} onChange={e => setServerName(e.target.value)} className="w-full bg-[#202225] p-2 rounded text-white outline-none focus:ring-2 ring-[#5865F2]" />
                         </div>
                     </div>
                    <div className="absolute top-14 right-10 flex flex-col items-center cursor-pointer text-[#b9bbbe] hover:text-white" onClick={() => setActiveModal(null)}>
                        <div className="border-2 border-current rounded-full p-1 mb-1"><X size={16}/></div>
                        <span className="text-xs font-bold">ESC</span>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  const ChannelSettingsModal = () => {
    if (!modalData) return null;
    const channel = modalData;
    
    return (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-80 animate-in fade-in">
             <div className="flex w-full h-full max-w-5xl mx-auto">
                <div className="w-[220px] bg-[#2f3136] flex flex-col items-end pt-14 pr-2">
                    <div className="text-xs font-bold text-[#96989d] uppercase px-2.5 mb-2">{channel.name}</div>
                    <div className="px-2.5 py-1.5 mb-0.5 rounded cursor-pointer text-sm w-48 bg-[#40444b] text-white">Overview</div>
                    <div className="px-2.5 py-1.5 mb-0.5 rounded cursor-pointer text-sm w-48 text-[#b9bbbe] hover:bg-[#36393f]">Permissions</div>
                    <div className="w-48 h-[1px] bg-[#40444b] my-2"></div>
                    <div className="px-2.5 py-1.5 rounded cursor-pointer text-sm w-48 text-[#ed4245] hover:bg-[#36393f]">Delete Channel</div>
                </div>
                <div className="flex-1 bg-[#36393f] pt-14 px-10 relative">
                    <h2 className="text-xl font-bold text-white mb-6">Overview</h2>
                    <div className="mb-6">
                        <label className="text-xs font-bold text-[#b9bbbe] uppercase mb-2 block">Channel Name</label>
                        <input defaultValue={channel.name} className="w-full bg-[#202225] p-2 rounded text-white outline-none" />
                    </div>
                    <div className="mb-6">
                        <label className="text-xs font-bold text-[#b9bbbe] uppercase mb-2 block">Channel Location</label>
                        <div className="flex space-x-2">
                            <button onClick={() => handleChannelReorder(channel.id, 'up')} className="bg-[#2f3136] text-white px-4 py-2 rounded flex items-center hover:bg-[#40444b]"><ArrowUp size={16} className="mr-2"/> Move Up</button>
                            <button onClick={() => handleChannelReorder(channel.id, 'down')} className="bg-[#2f3136] text-white px-4 py-2 rounded flex items-center hover:bg-[#40444b]"><ArrowDown size={16} className="mr-2"/> Move Down</button>
                        </div>
                    </div>
                     <div className="absolute top-14 right-10 flex flex-col items-center cursor-pointer text-[#b9bbbe] hover:text-white" onClick={() => setActiveModal(null)}>
                        <div className="border-2 border-current rounded-full p-1 mb-1"><X size={16}/></div>
                        <span className="text-xs font-bold">ESC</span>
                    </div>
                </div>
             </div>
        </div>
    );
  };

  // --- Main Layout ---

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#36393f] font-sans select-none text-[#dcddde]">
      
      {/* 1. Server Rail */}
      <nav className="no-scrollbar flex w-[72px] flex-col items-center overflow-y-auto bg-[#202225] py-3 z-20">
        <ServerIcon isHome />
        <div className="mx-auto mb-2 mt-2 h-[2px] w-8 rounded-lg bg-[#36393f]" />
        {servers.map(s => <ServerIcon key={s.id} server={s} />)}
        <div className="mx-auto mb-2 mt-2 h-[2px] w-8 rounded-lg bg-[#36393f]" />
        <ServerIcon isAdd />
      </nav>

      {/* 2. Sidebar */}
      <div className="flex w-60 flex-col bg-[#2f3136]">
        {activeServerId === 'home' ? (
            <div className="h-12 flex items-center justify-center shadow-sm px-2">
                <button className="bg-[#202225] text-[#949BA4] text-sm w-full text-left px-2 py-1 rounded text-center">Find or start a conversation</button>
            </div>
        ) : (
            <header 
                className="flex h-12 items-center justify-between px-4 shadow-sm hover:bg-[#34373c] cursor-pointer relative transition-colors"
                onClick={() => setServerDropdownOpen(!serverDropdownOpen)}
            >
                <h1 className="truncate font-bold text-white font-bold text-[15px]">{activeServer?.name}</h1>
                {serverDropdownOpen ? <X size={20}/> : <ChevronDown size={20} />}
                {serverDropdownOpen && (
                    <div className="absolute top-12 left-2 w-56 bg-[#18191c] rounded p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-75">
                        <div className="px-2 py-1.5 hover:bg-[#5865F2] hover:text-white rounded text-[#949cf7] flex justify-between items-center text-sm font-medium cursor-pointer">Server Boost <Gift size={16}/></div>
                        <div className="h-[1px] bg-[#2f3136] my-1"></div>
                        <div className="px-2 py-1.5 hover:bg-[#5865F2] hover:text-white rounded text-[#b9bbbe] flex justify-between items-center text-sm cursor-pointer" onClick={(e) => {e.stopPropagation(); setActiveModal('serverSettings')}}>Server Settings <Settings size={16}/></div>
                        <div className="px-2 py-1.5 hover:bg-[#5865F2] hover:text-white rounded text-[#b9bbbe] flex justify-between items-center text-sm cursor-pointer" onClick={(e) => {e.stopPropagation(); setActiveModal('createChannel')}}>Create Channel <Plus size={16}/></div>
                        <div className="h-[1px] bg-[#2f3136] my-1"></div>
                        <div className="px-2 py-1.5 hover:bg-[#ed4245] hover:text-white rounded text-[#ed4245] flex justify-between items-center text-sm cursor-pointer">Leave Server <LogOut size={16}/></div>
                    </div>
                )}
            </header>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-3 space-y-[2px]">
            {activeServerId === 'home' ? (
                <>
                    <div className="flex items-center px-2 mx-2 py-2 rounded bg-[#40444b] text-white cursor-pointer"><Users size={20} className="mr-3"/><span className="font-medium">Friends</span></div>
                    <div className="pt-4 px-4 text-xs font-bold text-[#949BA4] uppercase flex justify-between group hover:text-[#dcddde]"><span>Direct Messages</span><Plus size={14} className="cursor-pointer"/></div>
                    <div className="mt-2 px-2 space-y-[1px]">
                        {dms.map(dm => {
                            const recipient = friends.find(f => f.id === dm.recipientId);
                            if (!recipient) return null;
                            const isActive = activeChannelId === dm.id;
                            return (
                                <div key={dm.id} onClick={() => setActiveChannelId(dm.id)} className={`flex items-center px-2 py-1.5 rounded cursor-pointer group ${isActive ? 'bg-[#40444b] text-white' : 'text-[#949BA4] hover:bg-[#34373c] hover:text-[#dcddde]'}`}>
                                    <div className="relative mr-3"><img src={recipient.avatar} className="w-8 h-8 rounded-full"/><div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-[3px] border-[#2f3136] ${recipient.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div></div>
                                    <div className="font-medium truncate flex-1">{recipient.username}</div>
                                    <X className="w-4 h-4 opacity-0 group-hover:opacity-100 hover:text-white"/>
                                </div>
                            )
                        })}
                    </div>
                </>
            ) : (
                ['Information', 'Development', 'Voice Channels', 'Gaming', 'Off-Topic', 'General'].map(category => {
                    const cats = currentChannels.filter(c => (c.category || 'General') === category);
                    if (!cats.length) return null;
                    return (
                        <div key={category} className="mb-4">
                             <div className="flex items-center px-4 mb-1 text-xs font-bold uppercase text-[#949BA4] hover:text-[#dcddde] cursor-pointer group transition-colors">
                                <ChevronDown size={10} className="mr-1" /> {category}
                                <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 hover:text-white" onClick={(e) => {e.stopPropagation(); setActiveModal('createChannel')}}/>
                            </div>
                            {cats.map(c => {
                                const isActive = activeChannelId === c.id;
                                const isVoice = c.type === 'voice';
                                return (
                                    <div key={c.id} onClick={() => isVoice ? setVoiceState({name: c.name}) : setActiveChannelId(c.id)} className={`group mx-2 flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors ${isActive ? 'bg-[rgba(79,84,92,0.32)] text-white' : 'text-[#8e9297] hover:bg-[rgba(79,84,92,0.16)] hover:text-[#dcddde]'}`}>
                                        {isVoice ? <Volume2 size={20} className="mr-1.5"/> : <Hash size={20} className="mr-1.5 text-[#72767d]"/>}
                                        <span className={`truncate font-medium flex-1 ${isActive ? 'text-white' : ''}`}>{c.name}</span>
                                        <Settings size={14} className="ml-2 hidden group-hover:block text-[#b9bbbe] hover:text-white" onClick={(e) => { e.stopPropagation(); setModalData(c); setActiveModal('channelSettings'); }}/>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })
            )}
        </div>

        {/* User Controls */}
        <div className="flex h-[52px] items-center bg-[#292b2f] px-2 z-10 shrink-0">
             <div 
                className="group flex items-center rounded-md py-1 pl-0.5 pr-2 hover:bg-[#393c43] cursor-pointer mr-auto"
                onClick={() => { setModalData(currentUser); setActiveModal('userProfile'); }}
            >
                <UserAvatar user={currentUser} size="md" />
                <div className="text-sm overflow-hidden ml-2">
                    <div className="font-semibold text-white text-[13px] leading-tight truncate w-20">{currentUser.username}</div>
                    <div className="text-xs text-[#b9bbbe] leading-tight truncate">#{currentUser.discriminator}</div>
                </div>
            </div>
            <div className="flex items-center">
                <button onClick={() => setCurrentUser(u => ({...u, micMuted: !u.micMuted}))} className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#393c43] text-[#b9bbbe] hover:text-white relative">
                    {currentUser.micMuted ? <MicOff size={20} className="text-[#ed4245]"/> : <Mic size={20} />}
                </button>
                <button onClick={() => setCurrentUser(u => ({...u, soundMuted: !u.soundMuted}))} className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#393c43] text-[#b9bbbe] hover:text-white">
                    {currentUser.soundMuted ? <Headphones size={20} className="text-[#ed4245]"/> : <Headphones size={20} />}
                </button>
                <button onClick={() => setActiveModal('userSettings')} className="flex h-8 w-8 items-center justify-center rounded hover:bg-[#393c43] text-[#b9bbbe] hover:text-white">
                    <Settings size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* 3. Main Content */}
      <main className="flex min-w-0 flex-1 flex-col bg-[#36393f] relative">
        {activeServerId === 'home' && !activeChannelId ? (
            <div className="flex-1 flex flex-col">
                <div className="h-12 border-b border-[#202225] flex items-center px-4 shadow-sm"><Users size={24} className="mr-2 text-[#72767d]"/><span className="font-bold text-white">Friends</span></div>
                <div className="p-8">
                    <div className="text-[#b9bbbe] text-xs font-bold uppercase mb-4">Online — {friends.filter(f=>f.status !== 'offline').length}</div>
                    {friends.map(f => (
                        <div key={f.id} className="flex items-center justify-between p-2.5 border-t border-[#3f4147] hover:bg-[#40444b] rounded cursor-pointer group" onClick={() => handleStartDM(f.id)}>
                            <div className="flex items-center"><UserAvatar user={f} size="md"/><div className="ml-3"><div className="text-white font-bold">{f.username}</div><div className="text-xs text-[#b9bbbe]">{f.activity || f.status}</div></div></div>
                            <div className="flex space-x-2"><div className="w-8 h-8 rounded-full bg-[#2f3136] flex items-center justify-center text-[#b9bbbe] hover:text-white"><MessageSquare size={18}/></div></div>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <>
                <header className="flex h-12 items-center border-b border-[#202225] px-4 shadow-sm justify-between shrink-0 z-10 bg-[#36393f]">
                    <div className="flex items-center min-w-0">
                        <Hash className="mr-2 text-[#72767d] shrink-0" size={24} />
                        <h3 className="font-bold text-white truncate mr-4">{currentChannelName}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-[#b9bbbe] shrink-0">
                         <Users size={24} className={`cursor-pointer hover:text-[#dcddde] ${membersSidebarOpen ? 'text-[#dcddde]' : ''}`} onClick={() => setMembersSidebarOpen(!membersSidebarOpen)}/>
                         <div className="relative"><input className="bg-[#202225] text-sm rounded transition-all w-36 focus:w-60 px-2 py-1 text-white outline-none" placeholder="Search" /><Search size={16} className="absolute right-2 top-1.5 text-[#b9bbbe]"/></div>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col px-4 pb-4">
                     <div className="mt-auto">
                        {currentChannelMessages.map((msg, i) => {
                             const prev = currentChannelMessages[i-1];
                             const shouldGroup = prev && prev.authorId === msg.authorId && (new Date(msg.timestamp) - new Date(prev.timestamp) < 300000);
                             // Resolve author
                             let author = currentUser;
                             if (msg.authorId !== currentUser.id) {
                                 author = activeServerId === 'home' ? friends.find(f => f.id === msg.authorId) : Object.values(INITIAL_DATA.members).flat().find(m => m.id === msg.authorId);
                             }
                             return (
                                 <div key={msg.id} className={`group relative flex pr-4 pl-4 ${shouldGroup ? 'py-0.5 mt-0.5' : 'py-0.5 mt-4'} hover:bg-[#32353b]`}>
                                     {!shouldGroup && <div className="absolute left-4 mt-0.5 cursor-pointer" onClick={() => {setModalData(author); setActiveModal('userProfile')}}><UserAvatar user={author || currentUser} size="md" showStatus={false}/></div>}
                                     <div className="pl-[50px] w-full">
                                         {!shouldGroup && <div className="flex items-center"><span className="mr-2 font-medium text-white hover:underline cursor-pointer" onClick={() => {setModalData(author); setActiveModal('userProfile')}}>{author?.username || 'Unknown'}</span><span className="text-xs text-[#72767d]">{formatTime(msg.timestamp)}</span></div>}
                                         <div className="text-[#dcddde] whitespace-pre-wrap">{renderMessageContent(msg.content)}</div>
                                     </div>
                                 </div>
                             )
                        })}
                        <div ref={messagesEndRef} />
                     </div>
                </div>

                <div className="px-4 pb-6 shrink-0">
                     <div className="relative flex items-center rounded-lg bg-[#40444b] px-4 py-2.5">
                        <button className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#b9bbbe] text-[#40444b] hover:text-white"><Plus size={16} className="font-bold"/></button>
                        <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={handleSendMessage} placeholder={`Message #${currentChannelName}`} className="flex-1 bg-transparent text-[#dcddde] outline-none" autoFocus/>
                        <div className="ml-3 flex items-center space-x-3 text-[#b9bbbe] relative">
                            <Smile size={24} className="cursor-pointer hover:text-[#dcddde]" onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}/>
                            {emojiPickerOpen && (
                                <div className="absolute bottom-10 right-0 bg-[#2f3136] p-4 rounded shadow-xl w-64 grid grid-cols-6 gap-2 z-50 border border-[#202225]">
                                    {INITIAL_DATA.emojis.map(e => <div key={e} onClick={() => setInputMessage(p => p + e)} className="text-2xl cursor-pointer hover:bg-[#40444b] rounded p-1">{e}</div>)}
                                </div>
                            )}
                        </div>
                     </div>
                </div>
            </>
        )}
      </main>
      
      {/* Right Sidebar */}
      {activeServerId !== 'home' && membersSidebarOpen && (
         <aside className="hidden w-60 flex-col bg-[#2f3136] md:flex shrink-0 overflow-hidden">
             <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                 {/* Group by Roles Mock */}
                 <div className="mb-6">
                     <div className="px-2 mb-2 text-xs font-bold text-[#949BA4] uppercase">Members</div>
                     {INITIAL_DATA.members[activeServerId]?.map(m => (
                         <div key={m.id} className="flex items-center px-2 py-1.5 rounded hover:bg-[#36393f] cursor-pointer opacity-90 hover:opacity-100" onClick={() => {setModalData(m); setActiveModal('userProfile')}}>
                             <div className="relative mr-3"><UserAvatar user={m} size="sm"/></div>
                             <div className="font-medium" style={{ color: m.color }}>{m.username}</div>
                         </div>
                     ))}
                 </div>
             </div>
         </aside>
      )}

      {/* Modals */}
      {activeModal === 'userSettings' && <UserSettingsModal />}
      {activeModal === 'serverSettings' && <ServerSettingsModal />}
      {activeModal === 'channelSettings' && <ChannelSettingsModal />}
      {activeModal === 'userProfile' && modalData && (
          <div className="fixed inset-0 z-50 bg-transparent" onClick={() => setActiveModal(null)}>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] bg-[#18191c] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
                  <div className="h-24 w-full" style={{backgroundColor: modalData.color || '#5865F2'}}></div>
                  <div className="px-4 pb-4 relative">
                      <div className="w-20 h-20 rounded-full border-[6px] border-[#18191c] absolute -top-10 bg-[#18191c]"><img src={modalData.avatar} className="w-full h-full rounded-full"/></div>
                      <div className="mt-12 mb-4">
                          <h3 className="text-white font-bold text-lg">{modalData.username}<span className="text-[#b9bbbe] text-base ml-1">#{modalData.discriminator}</span></h3>
                          <div className="text-[#b9bbbe] text-sm mt-1 border-t border-[#2f3136] pt-2">{modalData.activity || "Just chilling"}</div>
                          <input className="w-full bg-[#5865F2] text-white font-medium text-sm p-2 rounded mt-4 outline-none cursor-pointer hover:bg-[#4752c4] text-center" readOnly value="Message" onClick={() => handleStartDM(modalData.id)}/>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; background-color: #2e3338; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #202225; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #2f3136; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
