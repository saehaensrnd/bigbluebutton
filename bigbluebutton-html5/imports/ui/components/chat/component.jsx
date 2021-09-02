import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import Button from '/imports/ui/components/button/component';
import { Session } from 'meteor/session';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import ChatLogger from '/imports/ui/components/chat/chat-logger/ChatLogger';
import { styles } from './styles.scss';
import MessageForm from './message-form/container';
import TimeWindowList from './time-window-list/container';
import ChatDropdownContainer from './chat-dropdown/container';
import { UserSentMessageCollection } from './service';
import Auth from '/imports/ui/services/auth';
import Users from '/imports/api/users';

const ELEMENT_ID = 'chat-messages';

const intlMessages = defineMessages({
  closeChatLabel: {
    id: 'app.chat.closeChatLabel',
    description: 'aria-label for closing chat button',
  },
  hideChatLabel: {
    id: 'app.chat.hideChatLabel',
    description: 'aria-label for hiding chat button',
  },
});

const Chat = (props) => {
  const {
    chatID,
    title,
    messages,
    partnerIsLoggedOut,
    isChatLocked,
    actions,
    intl,
    shortcuts,
    isMeteorConnected,
    lastReadMessageTime,
    hasUnreadMessages,
    scrollPosition,
    UnsentMessagesCollection,
    minMessageLength,
    maxMessageLength,
    amIModerator,
    meetingIsBreakout,
    timeWindowsValues,
    dispatch,
    count,
    syncing,
    syncedPercent,
    lastTimeWindowValuesBuild,
  } = props;

  const userSentMessage = UserSentMessageCollection.findOne({ userId: Auth.userID, sent: true });

  const HIDE_CHAT_AK = shortcuts.hideprivatechat;
  const CLOSE_CHAT_AK = shortcuts.closeprivatechat;
  ChatLogger.debug('ChatComponent::render', props);


  const users = Users.find({
    meetingId: Auth.meetingID,
  }, { fields: { userId: 1, emoji: 1 } });

  return (
    <div
      data-test={chatID !== 'public' ? 'privateChat' : 'publicChat'}
      className={styles.chat}
    >
      <header className={styles.header}>
        <div
          data-test="chatTitle"
          className={styles.title}
        >
          <Button
            onClick={() => {
              Session.set('idChatOpen', '');
              Session.set('openPanel', 'userlist');
              window.dispatchEvent(new Event('panelChanged'));
            }}
            aria-label={intl.formatMessage(intlMessages.hideChatLabel, { 0: title })}
            accessKey={chatID !== 'public' ? HIDE_CHAT_AK : null}
            label={title}
            icon="left_arrow"
            className={styles.hideBtn}
          />
        </div>
        {
          chatID !== 'public'
            ? (
              <Button
                icon="close"
                size="sm"
                ghost
                color="dark"
                hideLabel
                onClick={() => {
                  actions.handleClosePrivateChat(chatID);
                  Session.set('idChatOpen', '');
                  Session.set('openPanel', 'userlist');
                  window.dispatchEvent(new Event('panelChanged'));
                }}
                aria-label={intl.formatMessage(intlMessages.closeChatLabel, { 0: title })}
                label={intl.formatMessage(intlMessages.closeChatLabel, { 0: title })}
                accessKey={CLOSE_CHAT_AK}
              />
            )
            : (
              <ChatDropdownContainer {...{
                meetingIsBreakout, isMeteorConnected, amIModerator, timeWindowsValues,
              }}
              />
            )
        }
      </header>
      <TimeWindowList
        id={ELEMENT_ID}
        chatId={chatID}
        handleScrollUpdate={actions.handleScrollUpdate}
        {...{
          partnerIsLoggedOut,
          lastReadMessageTime,
          hasUnreadMessages,
          scrollPosition,
          messages,
          currentUserIsModerator: amIModerator,
          timeWindowsValues,
          dispatch,
          count,
          syncing,
          syncedPercent,
          lastTimeWindowValuesBuild,
          userSentMessage
        }}
      />
      <MessageForm
        {...{
          UnsentMessagesCollection,
          title,
          minMessageLength,
          maxMessageLength,
        }}
        chatId={chatID}
        chatTitle={title}
        chatAreaId={ELEMENT_ID}
        disabled={isChatLocked || !isMeteorConnected}
        connected={isMeteorConnected}
        locked={isChatLocked}
        handleSendMessage={actions.handleSendMessage}
        partnerIsLoggedOut={partnerIsLoggedOut}
        users={users}
      />
    </div>
  );
};

export default memo(withShortcutHelper(injectWbResizeEvent(injectIntl(Chat)), ['hidePrivateChat', 'closePrivateChat']));

const propTypes = {
  chatID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  shortcuts: PropTypes.objectOf(PropTypes.string),
  partnerIsLoggedOut: PropTypes.bool.isRequired,
  isChatLocked: PropTypes.bool.isRequired,
  isMeteorConnected: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    handleClosePrivateChat: PropTypes.func.isRequired,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

const defaultProps = {
  shortcuts: [],
};

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;
