import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { injectIntl } from 'react-intl';
import { withModalMounter } from '/imports/ui/components/common/modal/service';
import VideoPreviewContainer from '/imports/ui/components/video-preview/container';
import JoinVideoButton from './component';
import VideoService from '../service';
import Auth from '/imports/ui/services/auth';

const JoinVideoOptionsContainer = (props) => {
  const {
    hasVideoStream,
    disableReason,
    intl,
    mountModal,
    ...restProps
  } = props;

  const mountVideoPreview = () => { mountModal(<VideoPreviewContainer forceOpen={false} />); };
  const forceMountVideoPreview = () => { mountModal(<VideoPreviewContainer forceOpen />); };

  const isObserver = Auth.fullname.indexOf("observer") != -1;

  if(!isObserver){
    return (
      <JoinVideoButton {...{
        mountVideoPreview, forceMountVideoPreview, hasVideoStream, disableReason, ...restProps,
      }}
      />
    );
  } else {
    return null;
  }
  
};

export default withModalMounter(injectIntl(withTracker(() => ({
  hasVideoStream: VideoService.hasVideoStream(),
  disableReason: VideoService.disableReason(),
}))(JoinVideoOptionsContainer)));
