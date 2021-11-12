import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import Modal from 'react-modal';
import browserInfo from '/imports/utils/browserInfo';
import deviceInfo from '/imports/utils/deviceInfo';
import PanelManager from '/imports/ui/components/panel-manager/component';
import PollingContainer from '/imports/ui/components/polling/container';
import logger from '/imports/startup/client/logger';
import ActivityCheckContainer from '/imports/ui/components/activity-check/container';
import UserInfoContainer from '/imports/ui/components/user-info/container';
import BreakoutRoomInvitation from '/imports/ui/components/breakout-room/invitation/container';
import ToastContainer from '../toast/container';
import ModalContainer from '../modal/container';
import NotificationsBarContainer from '../notifications-bar/container';
import AudioContainer from '../audio/container';
import ChatAlertContainer from '../chat/alert/container';
import BannerBarContainer from '/imports/ui/components/banner-bar/container';
import WaitingNotifierContainer from '/imports/ui/components/waiting-users/alert/container';
import LockNotifier from '/imports/ui/components/lock-viewers/notify/container';
import StatusNotifier from '/imports/ui/components/status-notifier/container';
import MediaService from '/imports/ui/components/media/service';
import ManyWebcamsNotifier from '/imports/ui/components/video-provider/many-users-notify/container';
import UploaderContainer from '/imports/ui/components/presentation/presentation-uploader/container';
import RandomUserSelectContainer from '/imports/ui/components/modal/random-user/container';
import { withDraggableContext } from '../media/webcam-draggable-overlay/context';
import { styles } from './styles';
import { makeCall } from '/imports/ui/services/api';
import ConnectionStatusService from '/imports/ui/components/connection-status/service';
import { NAVBAR_HEIGHT, LARGE_NAVBAR_HEIGHT } from '/imports/ui/components/layout/layout-manager/component';
import Auth from '/imports/ui/services/auth';
import Attendance from '/imports/ui/services/attendance';
import Button from '/imports/ui/components/button/component';

const MOBILE_MEDIA = 'only screen and (max-width: 40em)';
const APP_CONFIG = Meteor.settings.public.app;
const DESKTOP_FONT_SIZE = APP_CONFIG.desktopFontSize;
const MOBILE_FONT_SIZE = APP_CONFIG.mobileFontSize;
const ENABLE_NETWORK_MONITORING = Meteor.settings.public.networkMonitoring.enableNetworkMonitoring;
const OVERRIDE_LOCALE = APP_CONFIG.defaultSettings.application.overrideLocale;

const intlMessages = defineMessages({
  userListLabel: {
    id: 'app.userList.label',
    description: 'Aria-label for Userlist Nav',
  },
  chatLabel: {
    id: 'app.chat.label',
    description: 'Aria-label for Chat Section',
  },
  mediaLabel: {
    id: 'app.media.label',
    description: 'Aria-label for Media Section',
  },
  actionsBarLabel: {
    id: 'app.actionsBar.label',
    description: 'Aria-label for ActionsBar Section',
  },
  iOSWarning: {
    id: 'app.iOSWarning.label',
    description: 'message indicating to upgrade ios version',
  },
  clearedEmoji: {
    id: 'app.toast.clearedEmoji.label',
    description: 'message for cleared emoji status',
  },
  setEmoji: {
    id: 'app.toast.setEmoji.label',
    description: 'message when a user emoji has been set',
  },
  raisedHand: {
    id: 'app.toast.setEmoji.raiseHand',
    description: 'toast message for raised hand notification',
  },
  loweredHand: {
    id: 'app.toast.setEmoji.lowerHand',
    description: 'toast message for lowered hand notification',
  },
  meetingMuteOn: {
    id: 'app.toast.meetingMuteOn.label',
    description: 'message used when meeting has been muted',
  },
  meetingMuteOff: {
    id: 'app.toast.meetingMuteOff.label',
    description: 'message used when meeting has been unmuted',
  },
  pollPublishedLabel: {
    id: 'app.whiteboard.annotations.poll',
    description: 'message displayed when a poll is published',
  },
});

const propTypes = {
  navbar: PropTypes.element,
  sidebar: PropTypes.element,
  media: PropTypes.element,
  actionsbar: PropTypes.element,
  captions: PropTypes.element,
  locale: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

const defaultProps = {
  navbar: null,
  sidebar: null,
  media: null,
  actionsbar: null,
  captions: null,
  locale: OVERRIDE_LOCALE || navigator.language,
};

const LAYERED_BREAKPOINT = 640;
const isLayeredView = window.matchMedia(`(max-width: ${LAYERED_BREAKPOINT}px)`);

class App extends Component {
  constructor() {
    super();
    this.state = {
      enableResize: !window.matchMedia(MOBILE_MEDIA).matches,
      isCloseMask: false,
    };

    this.handleWindowResize = throttle(this.handleWindowResize).bind(this);
    this.shouldAriaHide = this.shouldAriaHide.bind(this);
    this.renderMedia = withDraggableContext(this.renderMedia.bind(this));
  }

  componentDidMount() {
    const {
      locale, notify, intl, validIOSVersion, startBandwidthMonitoring, handleNetworkConnection, currentUserRole
    } = this.props;
    const { browserName } = browserInfo;
    const { isMobile, osName } = deviceInfo;

    MediaService.setSwapLayout();
    Modal.setAppElement('#app');

    document.getElementsByTagName('html')[0].lang = locale;
    document.getElementsByTagName('html')[0].style.fontSize = isMobile ? MOBILE_FONT_SIZE : DESKTOP_FONT_SIZE;

    const body = document.getElementsByTagName('body')[0];

    if (browserName) {
      body.classList.add(`browser-${browserName.split(' ').pop()
        .toLowerCase()}`);
    }

    body.classList.add(`os-${osName.split(' ').shift().toLowerCase()}`);

    if (!validIOSVersion()) {
      notify(
        intl.formatMessage(intlMessages.iOSWarning), 'error', 'warning',
      );
    }

    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize, false);
    window.ondragover = function (e) { e.preventDefault(); };
    window.ondrop = function (e) { e.preventDefault(); };

    if (ENABLE_NETWORK_MONITORING) {
      if (navigator.connection) {
        handleNetworkConnection();
        navigator.connection.addEventListener('change', handleNetworkConnection);
      }

      startBandwidthMonitoring();
    }

    if (isMobile) makeCall('setMobileUser');

    ConnectionStatusService.startRoundTripTime();

    logger.info({ logCode: 'app_component_componentdidmount' }, 'Client loaded successfully');


    let eventID = "user-joined";
    let name = Auth.fullname;
    //let userID = Auth.userID;
    let userID = Auth.externUserID;
    let userType = currentUserRole;

    console.log("extenr UserID : " + userID);

    
    if(userType === "MODERATOR")
      userType = "teacher";
    else if(userType === "VIEWER")
      userType = "student";
    else if(name.indexOf("observer") !== -1)
      userType = "observer";

    Attendance.checkAttendance(eventID, name, userID, userType);

  }

  componentDidUpdate(prevProps) {
    const {
      meetingMuted,
      notify,
      currentUserEmoji,
      intl,
      hasPublishedPoll,
      randomlySelectedUser,
      mountModal,
      isPresenter,
    } = this.props;

    if (!isPresenter && randomlySelectedUser.length > 0) mountModal(<RandomUserSelectContainer />);

    if (prevProps.currentUserEmoji.status !== currentUserEmoji.status) {
      const formattedEmojiStatus = intl.formatMessage({ id: `app.actionsBar.emojiMenu.${currentUserEmoji.status}Label` })
      || currentUserEmoji.status;

      const raisedHand = currentUserEmoji.status === 'raiseHand';

      let statusLabel = '';
      if (currentUserEmoji.status === 'none') {
        statusLabel = prevProps.currentUserEmoji.status === 'raiseHand'
          ? intl.formatMessage(intlMessages.loweredHand)
          : intl.formatMessage(intlMessages.clearedEmoji);
      } else {
        statusLabel = raisedHand
          ? intl.formatMessage(intlMessages.raisedHand)
          : intl.formatMessage(intlMessages.setEmoji, ({ 0: formattedEmojiStatus }));
      }

      // notify(
      //   statusLabel,
      //   'info',
      //   currentUserEmoji.status === 'none'
      //     ? 'clear_status'
      //     : 'user',
      // );

    //   console.log("APP Keys : " + Object.keys(this.props));
    //  console.log("APP prevProps Values : " + Object.values(this.props));
    //  console.log("--------------------------------------------")
    }
    if (!prevProps.meetingMuted && meetingMuted) {
      notify(
        intl.formatMessage(intlMessages.meetingMuteOn), 'info', 'mute',
      );
    }
    if (prevProps.meetingMuted && !meetingMuted) {
      notify(
        intl.formatMessage(intlMessages.meetingMuteOff), 'info', 'unmute',
      );
    }
    if (!prevProps.hasPublishedPoll && hasPublishedPoll) {
      notify(
        intl.formatMessage(intlMessages.pollPublishedLabel), 'info', 'polling',
      );
    }
  }

  componentWillUnmount() {
    const { handleNetworkConnection } = this.props;
    window.removeEventListener('resize', this.handleWindowResize, false);
    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleNetworkConnection, false);
    }

    ConnectionStatusService.stopRoundTripTime();
  }

  handleWindowResize() {
    const { enableResize } = this.state;
    const shouldEnableResize = !window.matchMedia(MOBILE_MEDIA).matches;
    if (enableResize === shouldEnableResize) return;

    this.setState({ enableResize: shouldEnableResize });
  }

  shouldAriaHide() {
    const { openPanel, isPhone } = this.props;
    return openPanel !== '' && (isPhone || isLayeredView.matches);
  }

  renderPanel() {
    const { enableResize } = this.state;
    const { openPanel, isRTL } = this.props;

    return (
      <PanelManager
        {...{
          openPanel,
          enableResize,
          isRTL,
        }}
        shouldAriaHide={this.shouldAriaHide}
      />
    );
  }

  renderNavBar() {
    const { navbar, isLargeFont } = this.props;

    if (!navbar) return null;

    const realNavbarHeight = isLargeFont ? LARGE_NAVBAR_HEIGHT : NAVBAR_HEIGHT;

    return (
      <header
        className={styles.navbar}
        style={{
          height: realNavbarHeight,
        }}
      >     
        {navbar}
      </header>
    );
  }

  renderCoachMarkTeacher(){

    return (
      <div className={styles.mask}>
        <div className={styles.mask_back}></div>

        <div className={styles.allowMic}>
          <img src="https://host/img/allowMic.png" width="317" height="128"/>
        </div>

        <div className={styles.allowCam}>
          <img src="https://host/img/allowCam.png" width="317" height="128"/>
        </div>

        <img className={styles.teacher_ments} src="https://host/img/teacherMents.png" width="507" height="293"/>

        <div className={styles.close_btn}>
          <Button
              // className={styles.close_btn}
              hideLabel
              aria-label="Close"
              label="Close"
              // icon="plus"
              icon="close"
              color="primary"
              size="lg"
              circle
              onClick={() => this.setState({ isCloseMask: true })}
            />
            <p>Close a guide screen</p>
          </div>
          <img className={styles.plus_content} src="https://host/img/plus_content.png" width="275" height="140"/>
          <img className={styles.setting} src="https://host/img/setting.png" width="160" height="240"/>

          <div className={styles.setting_content}>
            <p>End Meeting : The classroom is removed and all the users in the classroom are out</p>
            <p>Leave Meeting : To be out of the classroom</p>
          </div>
        
          <div className={styles.quick_menu}>
            <ul className={styles.quick_list}>
              <li><div className={styles.qlist}><span>Mic ON/OFF</span></div></li>
              <li><div className={styles.qlist}><span>Audio Setting</span></div></li>
              <li><div className={styles.qlist}><span>Webcam ON/OFF</span></div></li>
              <li><div className={styles.qlist}><span>Screen Share</span></div></li>
            </ul>
          </div>

          <div className={styles.raisehand_btn}>
            <img src="https://host/img/whiteboard.png" width="56" height="55"/>
            <p className={styles.p}>whiteboard</p>
          </div>
        </div>
    );

  }

  renderCoachMarkStudent(){
    return (
      <div className={styles.mask}>
        <div className={styles.mask_back}></div>

        <div className={styles.allowMic}>
          <img src="https://host/img/allowMic.png" width="317" height="128"/>
        </div>

        <div className={styles.allowCam}>
          <img src="https://host/img/allowCam.png" width="317" height="128"/>
        </div>

        <img className={styles.student_ments} src="https://host/img/studentMents.png" width="507" height="225"/>

        <div className={styles.close_btn}>
          <Button
              // className={styles.close_btn}
              hideLabel
              aria-label="Close"
              label="Close"
              // icon="plus"
              icon="close"
              color="primary"
              size="lg"
              circle
              onClick={() => this.setState({ isCloseMask: true })}
            />
            <p>가이드 화면 닫기</p>
          </div>
        
          <div className={styles.quick_menu}>
            <ul className={styles.quick_list}>
              <li><div className={styles.qlist}><span>마이크 ON/OFF</span></div></li>
              <li><div className={styles.qlist}><span>오디오 설정</span></div></li>
              <li><div className={styles.qlist}><span>웹캠 ON/OFF</span></div></li>
            </ul>
          </div>
          <div className={styles.whiteboard_btn}>
            <img src="https://host/img/whiteboard.png" width="56" height="55"/>
            <p className={styles.p}>칠판</p>
          </div>
          <div className={styles.raisehand_btn}>
            <img src="https://host/img/raisehand.png" width="56" height="55"/>
            <p className={styles.p}>손들기</p>
          </div>
          

        </div>
    );
  }


  renderCoachMark() {
    const { currentUserRole } = this.props;

    const isModerator = currentUserRole === "MODERATOR"? true : false;

    return isModerator? this.renderCoachMarkTeacher() : this.renderCoachMarkStudent();
    
  }




  renderSidebar() {
    const { sidebar } = this.props;

    if (!sidebar) return null;

    return (
      <aside className={styles.sidebar}>
        {sidebar}
      </aside>
    );
  }

  renderCaptions() {
    const { captions } = this.props;

    if (!captions) return null;

    return (
      <div className={styles.captionsWrapper}>
        {captions}
      </div>
    );
  }

  renderMedia() {
    const {
      media,
      intl,
    } = this.props;

    if (!media) return null;

    return (
      <section
        className={styles.media}
        aria-label={intl.formatMessage(intlMessages.mediaLabel)}
        aria-hidden={this.shouldAriaHide()}
      >
        {media}
        {this.renderCaptions()}
      </section>
    );
  }

  renderActionsBar() {
    const {
      actionsbar,
      intl,
    } = this.props;

    if (!actionsbar) return null;

    return (
      <section
        className={styles.actionsbar}
        aria-label={intl.formatMessage(intlMessages.actionsBarLabel)}
        aria-hidden={this.shouldAriaHide()}
      >
        {actionsbar}
      </section>
    );
  }

  renderActivityCheck() {
    const { User } = this.props;

    const { inactivityCheck, responseDelay } = User;

    return (inactivityCheck ? (
      <ActivityCheckContainer
        inactivityCheck={inactivityCheck}
        responseDelay={responseDelay}
      />
    ) : null);
  }

  renderUserInformation() {
    const { UserInfo, User } = this.props;

    return (UserInfo.length > 0 ? (
      <UserInfoContainer
        UserInfo={UserInfo}
        requesterUserId={User.userId}
        meetingId={User.meetingId}
      />
    ) : null);
  }

  render() {
    const {
      customStyle, customStyleUrl, openPanel, layoutContextState, currentUserRole
    } = this.props;

    const { isCloseMask } = this.state;
    
    return (
      // <main className={isCloseMask? styles.main : styles.main_mask}>
      <main className={isCloseMask? styles.main : styles.main_background}>
        {/* 로딩 완료(프레젠테이션, 웹캠 등 다 배치 되었을 때) 되었을 떄 띄우기 */}
        {!isCloseMask? this.renderCoachMark() : null}
        {this.renderActivityCheck()}
        {this.renderUserInformation()}
        <BannerBarContainer />
        <NotificationsBarContainer />
        <section className={isCloseMask? styles.wrapper : styles.wrapper_mask}>
          <Button
              className={styles.help_btn}
              hideLabel
              aria-label="Help"
              label="Help"
              icon="help"
              color="primary"
              size="md"
              circle
              onClick={() => this.setState({ isCloseMask: false })}
            />
          {this.renderSidebar()}
          {this.renderPanel()}
          <div className={openPanel ? styles.content : styles.noPanelContent}>
            {this.renderNavBar()}
            {this.renderMedia()}
            {this.renderActionsBar()}
          </div>
        </section>
        <UploaderContainer />
        <BreakoutRoomInvitation />
        {!layoutContextState.presentationIsFullscreen && !layoutContextState.screenShareIsFullscreen && <PollingContainer />}
        <ModalContainer />
        <AudioContainer />
        <ToastContainer rtl />
        <ChatAlertContainer />
        <WaitingNotifierContainer />
        <LockNotifier />
        <StatusNotifier status="raiseHand" />
        <ManyWebcamsNotifier />
        {customStyleUrl ? <link rel="stylesheet" type="text/css" href={customStyleUrl} /> : null}
        {customStyle ? <link rel="stylesheet" type="text/css" href={`data:text/css;charset=UTF-8,${encodeURIComponent(customStyle)}`} /> : null}
      </main>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default injectIntl(App);
