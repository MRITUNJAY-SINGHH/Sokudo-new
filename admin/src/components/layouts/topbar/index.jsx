import avatar3 from '@/assets/images/user/avatar-3.png';
import avatar5 from '@/assets/images/user/avatar-5.png';
import avatar7 from '@/assets/images/user/avatar-7.png';
import { Link } from 'react-router';
import { TbSearch } from 'react-icons/tb';
import SimpleBar from 'simplebar-react';
import SidenavToggle from './SidenavToggle';
import ThemeModeToggle from './ThemeModeToggle';
import {
  LuBellRing,
  LuClock,
  LuHeart,
  LuMoveRight,
  LuSettings,
  LuShoppingBag,
} from 'react-icons/lu';
import ProfileDropdown from './ProfileDropdown';
import ActionSearchBar from "./ActionSearchBar";


const tabs = [
  {
    id: 'tabsViewall',
    title: 'View all',
    active: true,
  },
  {
    id: 'tabsMentions',
    title: 'Mentions',
  },
  {
    id: 'tabsFollowers',
    title: 'Followers',
  },
  {
    id: 'tabsInvites',
    title: 'Invites',
  },
];
const notifications = {
  tabsViewall: [
    {
      type: 'follow',
      avatar: avatar3,
      text: (
        <>
          <b>@willie_passem</b> followed you
        </>
      ),
      time: 'Wednesday 03:42 PM',
      ago: '4 sec',
    },
    {
      type: 'comment',
      avatar: avatar5,
      text: (
        <>
          <b>@caroline_jessica</b> commented <br />
          on your post
        </>
      ),
      time: 'Wednesday 03:42 PM',
      ago: '15 min',
      comment: 'Amazing! Fast, to the point, professional and really amazing to work with them!!!',
    },
    {
      type: 'purchase',
      icon: <LuShoppingBag className="size-5 text-danger" />,
      text: (
        <>
          Successfully purchased a business plan for <span className="text-danger">$199.99</span>
        </>
      ),
      time: 'Monday 11:26 AM',
      ago: 'yesterday',
    },
    {
      type: 'like',
      avatar: avatar7,
      icon: <LuHeart className="size-3.5 fill-orange-500" />,
      text: (
        <>
          <b>@scott</b> liked your post
        </>
      ),
      time: 'Thursday 06:59 AM',
      ago: '1 Week',
    },
  ],
  tabsMentions: [
    {
      type: 'comment',
      avatar: avatar5,
      text: (
        <>
          <b>@caroline_jessica</b> commented <br />
          on your post
        </>
      ),
      time: 'Wednesday 03:42 PM',
      ago: '15 min',
      comment: 'Amazing! Fast, to the point, professional and really amazing to work with them!!!',
    },
    {
      type: 'like',
      avatar: avatar7,
      icon: <LuHeart className="size-3.5 fill-orange-500" />,
      text: (
        <>
          <b>@scott</b> liked your post
        </>
      ),
      time: 'Thursday 06:59 AM',
      ago: '1 Week',
    },
  ],
  tabsFollowers: [
    {
      type: 'follow',
      avatar: avatar3,
      text: (
        <>
          <b>@willie_passem</b> followed you
        </>
      ),
      time: 'Wednesday 03:42 PM',
      ago: '4 sec',
    },
  ],
  tabsInvites: [
    {
      type: 'purchase',
      icon: <LuShoppingBag className="size-5 text-danger" />,
      text: (
        <>
          Successfully purchased a business plan for <span className="text-danger">$199.99</span>
        </>
      ),
      time: 'Monday 11:26 AM',
      ago: 'yesterday',
    },
  ],
};

const Topbar = () => {
  return (
    <div className="app-header min-h-topbar-height flex items-center sticky top-0 z-30 bg-(--topbar-background) border-b border-default-200">
      <div className="w-full flex items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <SidenavToggle />

          <div className="lg:flex hidden items-center relative">
  <ActionSearchBar />
</div>

        </div>

        <div className="flex items-center gap-3">
          <ThemeModeToggle />

          <div className="topbar-item hs-dropdown [--auto-close:inside] relative inline-flex">
            {/* <button
              type="button"
              className="hs-dropdown-toggle btn btn-icon size-8 hover:bg-default-150 rounded-full relative"
            >
              <LuBellRing className="size-4.5" />
              <span className="absolute end-0 top-0 size-1.5 bg-primary/90 rounded-full"></span>
            </button> */}
            <div className="hs-dropdown-menu max-w-100 p-0">
              <div className="p-4 border-b border-default-200 flex items-center gap-2">
                <h3 className="text-base text-default-800">Notifications</h3>
                <span className="size-5 font-semibold bg-orange-500 rounded text-white flex items-center justify-center text-xs">
                  15
                </span>
              </div>

              <nav
                className="flex gap-x-1 bg-default-150 p-2 border-b border-default-200"
                role="tablist"
              >
                {tabs.map((tab, i) => (
                  <button
                    key={i}
                    data-hs-tab={`#${tab.id}`}
                    type="button"
                    className={`hs-tab-active:bg-card hs-tab-active:text-primary py-0.5 px-4 rounded font-semibold inline-flex items-center gap-x-2 border-b-2 border-transparent text-xs whitespace-nowrap text-default-500 hover:text-blue-600 ${tab.active ? 'active' : ''}`}
                  >
                    {tab.title}
                  </button>
                ))}
              </nav>

              <SimpleBar className="h-80">
                {tabs.map((tab, i) => (
                  <div key={i} id={tab.id} className={tab.active ? '' : 'hidden'}>
                    {notifications[tab.id]?.map((n, j) => (
                      <Link
                        key={j}
                        to="#"
                        className="flex gap-3 p-4 items-start hover:bg-default-150"
                      >
                        {n.avatar ? (
                          <div className="relative">
                            <div className="size-10 rounded-md bg-default-100 flex justify-center items-center">
                              <img src={n.avatar} alt="avatar" className="rounded-md" />
                            </div>
                            {n.icon && (
                              <div className="absolute bottom-0 -end-0.5 text-orange-500">
                                {n.icon}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="size-10 rounded-md bg-red-100 flex justify-center items-center">
                            {n.icon}
                          </div>
                        )}
                        <div className="flex justify-between w-full text-sm">
                          <div>
                            <h6 className="mb-2 font-medium text-default-800">{n.text}</h6>
                            <p className="flex items-center gap-1 text-default-500 text-xs">
                              <LuClock className="size-3.5" /> <span>{n.time}</span>
                            </p>
                            {n.comment && (
                              <p className="p-2 bg-default-50 text-default-500 mt-2 rounded">
                                {n.comment}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-default-500">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {n.ago}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </SimpleBar>

              <div className="flex items-center justify-between p-4 border-t border-default-200">
                <Link to="#!" className="text-sm font-medium text-default-900">
                  Manage Notification
                </Link>
                <button type="button" className="btn btn-sm text-white bg-primary">
                  View All <LuMoveRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="topbar-item">
            <button
              className="btn btn-icon size-8 hover:bg-default-150 rounded-full"
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="theme-customization"
              data-hs-overlay="#theme-customization"
            >
              <LuSettings className="size-4.5" />
            </button>
          </div>

          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};
export default Topbar;
