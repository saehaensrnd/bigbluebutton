import styled from 'styled-components';
import { barsPadding } from '/imports/ui/stylesheets/styled-components/general';
import { FlexColumn } from '/imports/ui/stylesheets/styled-components/placeholders';

const MaskWrapper = styled.div`
  position:absolute;
  width : 100%;
  height: 100%;
  z-index: 9000;
`;

const BackgroundWrapper = styled.div`
  position:absolute;
  width : 100%;
  height: 100%;
  z-index: 8000;
  background: #000000;
  opacity: 0.5;

`;

const MaskBackWrapper = styled.div`
  position:absolute;
  width : 100%;
  height: 100%;
  background: url("https://webconf.saehaens.com/images/bbb_bg.png");
`;

// const MaskBackWrapper = styled.div`
//   position:absolute;
//   width : 100%;
//   height: 100%;
//   background: #000000;
//   opacity: 0.3;
// `;




const MainWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const MainBackWrapper = styled.div`
  position: relative;
  height: 100%;
  background-color: #000000;
`;

const LeaveCoachMarkBtnWrapper = styled.div`
  position:absolute;
  margin-top: 10px;
  margin-right: 50px;
  right: 0%;
  color:rgb(255, 255, 255);
  text-align: center;
  vertical-align:middle;
`;

const WhiteboardBtnWrapper = styled.div`
  position: absolute;
  margin-right: 19px;
  right: 0;
  bottom: 0;
  margin-bottom: 63px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: large;
  text-align: center;
`;

const CloseBtnWrapper = styled.div`
  position:absolute;
  margin-top: 10px;
  left: 50%;
  color:rgb(255, 255, 255);
  text-align: center;
`;

const LeaveBtnWrapper = styled.div`
  position:absolute;
  right: 0;
  margin-right: 162px;
  margin-top: 13px;
  z-index: 1;
`;

const HelpBtnWrapper = styled.div`
  position:absolute;
  right: 0;
  margin-right: 105px;
  margin-top: 13px;
  z-index: 1;
`;

const SettingContentWrapper = styled.div`
  position:absolute;
  margin-top: 225px;
  margin-right: 175px;
  right: 0;
  color:rgb(255, 255, 255);
  text-align: right;
`;

const QuickMenuWrapper = styled.div`
  margin:0 0px 90px; 
  text-align:center; 
  position:absolute;
  left: 50%;
  bottom: 0;
  margin-bottom: 90px;
  list-style: none;
`;

const QuickListWrapper = styled.ul`
  width:100%; 
  margin:0 auto;
  margin-top:15px;
`;

const MicLiWrapper = styled.li`
  list-style-type: none;
  align-items: center;
  background: url("https://webconf.saehaens.com/icon/mic.png") left center no-repeat;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 80px;
  line-height: 55px;
  color: white;
`;

const AudioLiWrapper = styled.li`
  list-style-type: none;
  align-items: center;
  background: url("https://webconf.saehaens.com/icon/audio.png") left center no-repeat;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 80px;
  line-height: 55px;
  color: white;
`;

const WebcamLiWrapper = styled.li`
  list-style-type: none;
  align-items: center;
  background: url("https://webconf.saehaens.com/icon/webcam.png") left center no-repeat;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 80px;
  line-height: 55px;
  color: white;
`;

const ScreenshareLiWrapper = styled.li`
  list-style-type: none;
  align-items: center;
  background: url("https://webconf.saehaens.com/icon/screenshare.png") left center no-repeat;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 80px;
  line-height: 55px;
  color: white;
`;

const RaiseHandBtnWrapper = styled.div`
  position: absolute;
  margin-right: 19px;
  right: 0;
  bottom: 0;
  margin-bottom: 63px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: large;
  text-align: center;
`;



const SpanAlign = styled.span`
  margin-top: 13px;
  margin-left: 10px;
  float: right;
`;


const PlusContentWrapper = styled.div`
  position:absolute;
  margin-left: 230px;
  bottom: 0;
  margin-bottom: 60px;
`;

const SettingWrapper = styled.div`
  position:absolute;
  margin-right: 5px;
  right: 0;
  margin-top: 58px;
`;

const QListWrapper = styled.div`
  display:block; 
  width:90px; 
  height:90px; 
`;


const CaptionsWrapper = styled.div`
  height: auto;
  bottom: 100px;
  left: 20%;
  z-index: 5;
`;

const ActionsBar = styled.section`
  flex: 1;
  padding: ${barsPadding};
  position: relative;
  order: 3;
`;

const PWrapper = styled.p`
  height: 100%;
  line-height: 1px;
`;

const Layout = styled(FlexColumn)``;

export default {
  CaptionsWrapper,
  ActionsBar,
  Layout,
  MaskWrapper,
  MaskBackWrapper,
  LeaveCoachMarkBtnWrapper,
  CloseBtnWrapper,
  SettingContentWrapper,
  QuickMenuWrapper,
  QuickListWrapper,
  RaiseHandBtnWrapper,
  SpanAlign,
  PlusContentWrapper,
  SettingWrapper,
  QListWrapper,
  MicLiWrapper,
  AudioLiWrapper,
  WebcamLiWrapper,
  ScreenshareLiWrapper,
  MainWrapper,
  MainBackWrapper,
  BackgroundWrapper,
  LeaveBtnWrapper,
  HelpBtnWrapper,
  WhiteboardBtnWrapper,
  PWrapper,
};
