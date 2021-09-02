import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import UserDropdown from './user-dropdown/component';
import { notify } from '/imports/ui/services/notification';
import { defineMessages} from 'react-intl';

const propTypes = {
  compact: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  getAvailableActions: PropTypes.func.isRequired,
  isThisMeetingLocked: PropTypes.bool.isRequired,
  normalizeEmojiName: PropTypes.func.isRequired,
  getScrollContainerRef: PropTypes.func.isRequired,
  toggleUserLock: PropTypes.func.isRequired,
  isMeteorConnected: PropTypes.bool.isRequired,
};

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

const emojiArray = {

  away: "I'm out for a moment",
  raiseHand: "I have a question",
  //neutral: "Nothing",
  speakLouder: "Please speak Louder",
  speakSofter : 'Please speak Softer',
  speakFaster: 'Please speak Faster',
  speakSlower : 'Please speak Slower',
  thumbsUp: 'Good!',
  thumbsDown: 'Bad',

};

class UserListItem extends PureComponent {

  componentDidUpdate(prevProps){


    const { setEmojiStatus } = this.props;

    //   console.log("prevProps Keys : " + Object.keys(prevProps));
    //  console.log("prevProps Values : " + Object.values(prevProps));
    //  console.log("--------------------------------------------")

    //   console.log("this.props Keys : " + Object.keys(this.props));
    //   console.log("this.props Values : " + Object.values(this.props));
    //   console.log("--------------------------------------------")
    console.log(this.props.user.sortName + " : " + this.props.user.emoji);
    console.log("--------------------------------------------")
    //notify(this.props.user.sortName + " : " + emojiArray[this.props.user.emoji], 'info',  'user');
    //notify("hello???", 'info',  'user');
    // if(prevProps.user.emoji != this.props.user.emoji){
    //   if(this.props.user.emoji != "neutral" && this.props.user.emoji != "none")
    //     notify(this.props.user.sortName + " : " + emojiArray[this.props.user.emoji], 'info',  'user');
    //     setEmojiStatus(this.props.user.userId, 'none')
    //     console.log("emojijiji : " + this.props.user.emoji);
    // }

  }


  render() {
    const {
      user,
      assignPresenter,
      compact,
      currentUser,
      changeRole,
      getAvailableActions,
      getEmoji,
      getEmojiList,
      getGroupChatPrivate,
      getScrollContainerRef,
      intl,
      isThisMeetingLocked,
      lockSettingsProps,
      normalizeEmojiName,
      removeUser,
      setEmojiStatus,
      toggleVoice,
      hasPrivateChatBetweenUsers,
      toggleUserLock,
      requestUserInformation,
      userInBreakout,
      breakoutSequence,
      meetingIsBreakout,
      isMeteorConnected,
      isMe,
      usersProp,
      voiceUser,
      scrollArea,
      notify,
      raiseHandAudioAlert,
      raiseHandPushAlert,
      isRTL,
    } = this.props;

    console.log("ujpdateeeee");

    const contents = (
      <UserDropdown
        {...{
          assignPresenter,
          compact,
          changeRole,
          currentUser,
          getAvailableActions,
          getEmoji,
          getEmojiList,
          getGroupChatPrivate,
          getScrollContainerRef,
          intl,
          isThisMeetingLocked,
          lockSettingsProps,
          normalizeEmojiName,
          removeUser,
          setEmojiStatus,
          toggleVoice,
          user,
          hasPrivateChatBetweenUsers,
          toggleUserLock,
          requestUserInformation,
          userInBreakout,
          breakoutSequence,
          meetingIsBreakout,
          isMeteorConnected,
          isMe,
          usersProp,
          voiceUser,
          scrollArea,
          notify,
          raiseHandAudioAlert,
          raiseHandPushAlert,
          isRTL,
        }}
      />
    );

    return contents;
  }
}

UserListItem.propTypes = propTypes;

export default injectIntl(UserListItem);
