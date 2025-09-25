/* eslint-disable react/destructuring-assignment */
import React, { forwardRef, MouseEventHandler, useMemo, useRef } from 'react';
import { IRoomEvent, MatrixEvent, Room } from 'matrix-js-sdk';
import {
  Avatar,
  Box,
  Chip,
  color,
  config,
  Header,
  Icon,
  IconButton,
  Icons,
  Menu,
  Scroll,
  Text,
  toRem,
} from 'folds';
import { Opts as LinkifyOpts } from 'linkifyjs';
import { HTMLReactParserOptions } from 'html-react-parser';
import { useVirtualizer } from '@tanstack/react-virtual';
import * as css from './ThreadsMenu.css';
import { SequenceCard } from '../../../components/sequence-card';
import { useMediaAuthentication } from '../../../hooks/useMediaAuthentication';
import {
  AvatarBase,
  ImageContent,
  MessageNotDecryptedContent,
  MessageUnsupportedContent,
  ModernLayout,
  MSticker,
  RedactedContent,
  Reply,
  Time,
  Username,
  UsernameBold,
} from '../../../components/message';
import { UserAvatar } from '../../../components/user-avatar';
import { getMxIdLocalPart, mxcUrlToHttp } from '../../../utils/matrix';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import {
  getEditedEvent,
  getEventThreadDetail,
  getMemberAvatarMxc,
  getMemberDisplayName,
} from '../../../utils/room';
import { GetContentCallback, MessageEvent } from '../../../../types/matrix/room';
import { useMentionClickHandler } from '../../../hooks/useMentionClickHandler';
import { useSpoilerClickHandler } from '../../../hooks/useSpoilerClickHandler';
import {
  factoryRenderLinkifyWithMention,
  getReactCustomHtmlParser,
  LINKIFY_OPTS,
  makeMentionCustomProps,
  renderMatrixMention,
} from '../../../plugins/react-custom-html-parser';
import { RenderMatrixEvent, useMatrixEventRenderer } from '../../../hooks/useMatrixEventRenderer';
import { RenderMessageContent } from '../../../components/RenderMessageContent';
import { useSetting } from '../../../state/hooks/settings';
import { settingsAtom } from '../../../state/settings';
import * as customHtmlCss from '../../../styles/CustomHtml.css';
import { EncryptedContent } from '../message';
import { Image } from '../../../components/media';
import { ImageViewer } from '../../../components/image-viewer';
import { useRoomNavigate } from '../../../hooks/useRoomNavigate';
import { VirtualTile } from '../../../components/virtualizer';
import { usePowerLevelsContext } from '../../../hooks/usePowerLevels';
import { ContainerColor } from '../../../styles/ContainerColor.css';
import { usePowerLevelTags } from '../../../hooks/usePowerLevelTags';
import { useTheme } from '../../../hooks/useTheme';
import { PowerIcon } from '../../../components/power';
import colorMXID from '../../../../util/colorMXID';
import { useIsDirectRoom } from '../../../hooks/useRoom';
import { useRoomCreators } from '../../../hooks/useRoomCreators';
import {
  GetMemberPowerTag,
  getPowerTagIconSrc,
  useAccessiblePowerTagColors,
  useGetMemberPowerTag,
} from '../../../hooks/useMemberPowerTag';
import { useRoomCreatorsTag } from '../../../hooks/useRoomCreatorsTag';
import { useRoomMyThreads } from '../../../hooks/useRoomThreads';
import { ThreadSelector, ThreadSelectorContainer } from '../message/thread-selector';

type ThreadMessageProps = {
  room: Room;
  event: MatrixEvent;
  renderContent: RenderMatrixEvent<[MatrixEvent, string, GetContentCallback]>;
  onOpen: (roomId: string, eventId: string) => void;
  getMemberPowerTag: GetMemberPowerTag;
  accessibleTagColors: Map<string, string>;
  legacyUsernameColor: boolean;
  hour24Clock: boolean;
  dateFormatString: string;
};
function ThreadMessage({
  room,
  event,
  renderContent,
  onOpen,
  getMemberPowerTag,
  accessibleTagColors,
  legacyUsernameColor,
  hour24Clock,
  dateFormatString,
}: ThreadMessageProps) {
  const useAuthentication = useMediaAuthentication();
  const mx = useMatrixClient();

  const handleOpenClick: MouseEventHandler = (evt) => {
    evt.stopPropagation();
    const evtId = evt.currentTarget.getAttribute('data-event-id');
    if (!evtId) return;
    onOpen(room.roomId, evtId);
  };

  const renderOptions = () => (
    <Box shrink="No" gap="200" alignItems="Center">
      <Chip
        data-event-id={event.getId()}
        onClick={handleOpenClick}
        variant="Secondary"
        radii="Pill"
      >
        <Text size="T200">Open</Text>
      </Chip>
    </Box>
  );

  const sender = event.getSender()!;
  const displayName = getMemberDisplayName(room, sender) ?? getMxIdLocalPart(sender) ?? sender;
  const senderAvatarMxc = getMemberAvatarMxc(room, sender);
  const getContent = (() => event.getContent()) as GetContentCallback;

  const memberPowerTag = getMemberPowerTag(sender);
  const tagColor = memberPowerTag?.color
    ? accessibleTagColors?.get(memberPowerTag.color)
    : undefined;
  const tagIconSrc = memberPowerTag?.icon
    ? getPowerTagIconSrc(mx, useAuthentication, memberPowerTag.icon)
    : undefined;

  const usernameColor = legacyUsernameColor ? colorMXID(sender) : tagColor;

  return (
    <ModernLayout
      before={
        <AvatarBase>
          <Avatar size="300">
            <UserAvatar
              userId={sender}
              src={
                senderAvatarMxc
                  ? mxcUrlToHttp(mx, senderAvatarMxc, useAuthentication, 48, 48, 'crop') ??
                    undefined
                  : undefined
              }
              alt={displayName}
              renderFallback={() => <Icon size="200" src={Icons.User} filled />}
            />
          </Avatar>
        </AvatarBase>
      }
    >
      <Box gap="300" justifyContent="SpaceBetween" alignItems="Center" grow="Yes">
        <Box gap="200" alignItems="Baseline">
          <Box alignItems="Center" gap="200">
            <Username style={{ color: usernameColor }}>
              <Text as="span" truncate>
                <UsernameBold>{displayName}</UsernameBold>
              </Text>
            </Username>
            {tagIconSrc && <PowerIcon size="100" iconSrc={tagIconSrc} />}
          </Box>
          <Time ts={event.getTs()} hour24Clock={hour24Clock} dateFormatString={dateFormatString} />
        </Box>
        {renderOptions()}
      </Box>
      {event.replyEventId && (
        <Reply
          room={room}
          replyEventId={event.replyEventId}
          threadRootId={event.threadRootId}
          onClick={handleOpenClick}
          getMemberPowerTag={getMemberPowerTag}
          accessibleTagColors={accessibleTagColors}
          legacyUsernameColor={legacyUsernameColor}
        />
      )}
      {renderContent(event.getType(), false, event, displayName, getContent)}
    </ModernLayout>
  );
}

type ThreadsMenuProps = {
  room: Room;
  requestClose: () => void;
};
export const ThreadsMenu = forwardRef<HTMLDivElement, ThreadsMenuProps>(
  ({ room, requestClose }, ref) => {
    const mx = useMatrixClient();
    const powerLevels = usePowerLevelsContext();
    const creators = useRoomCreators(room);

    const creatorsTag = useRoomCreatorsTag();
    const powerLevelTags = usePowerLevelTags(room, powerLevels);
    const getMemberPowerTag = useGetMemberPowerTag(room, creators, powerLevels);

    const theme = useTheme();
    const accessibleTagColors = useAccessiblePowerTagColors(
      theme.kind,
      creatorsTag,
      powerLevelTags
    );

    const useAuthentication = useMediaAuthentication();
    const [mediaAutoLoad] = useSetting(settingsAtom, 'mediaAutoLoad');
    const [urlPreview] = useSetting(settingsAtom, 'urlPreview');

    const direct = useIsDirectRoom();
    const [legacyUsernameColor] = useSetting(settingsAtom, 'legacyUsernameColor');

    const [hour24Clock] = useSetting(settingsAtom, 'hour24Clock');
    const [dateFormatString] = useSetting(settingsAtom, 'dateFormatString');

    const { navigateRoom } = useRoomNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const events = useRoomMyThreads(room);

    const virtualizer = useVirtualizer({
      count: events?.length ?? 0,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => 75,
      overscan: 4,
    });

    const mentionClickHandler = useMentionClickHandler(room.roomId);
    const spoilerClickHandler = useSpoilerClickHandler();

    const linkifyOpts = useMemo<LinkifyOpts>(
      () => ({
        ...LINKIFY_OPTS,
        render: factoryRenderLinkifyWithMention((href) =>
          renderMatrixMention(mx, room.roomId, href, makeMentionCustomProps(mentionClickHandler))
        ),
      }),
      [mx, room, mentionClickHandler]
    );
    const htmlReactParserOptions = useMemo<HTMLReactParserOptions>(
      () =>
        getReactCustomHtmlParser(mx, room.roomId, {
          linkifyOpts,
          useAuthentication,
          handleSpoilerClick: spoilerClickHandler,
          handleMentionClick: mentionClickHandler,
        }),
      [mx, room, linkifyOpts, mentionClickHandler, spoilerClickHandler, useAuthentication]
    );

    const renderMatrixEvent = useMatrixEventRenderer<[MatrixEvent, string, GetContentCallback]>(
      {
        [MessageEvent.RoomMessage]: (event, displayName, getContent) => {
          if (event.isRedacted()) {
            return (
              <RedactedContent reason={event.getUnsigned().redacted_because?.content.reason} />
            );
          }

          const threadDetail = getEventThreadDetail(event);

          return (
            <>
              <RenderMessageContent
                displayName={displayName}
                msgType={event.getContent().msgtype ?? ''}
                ts={event.getTs()}
                getContent={getContent}
                edited={!!event.replacingEvent()}
                mediaAutoLoad={mediaAutoLoad}
                urlPreview={urlPreview}
                htmlReactParserOptions={htmlReactParserOptions}
                linkifyOpts={linkifyOpts}
                outlineAttachment
              />
              {threadDetail && (
                <ThreadSelectorContainer>
                  <ThreadSelector
                    room={room}
                    threadDetail={threadDetail}
                    outlined
                    hour24Clock={hour24Clock}
                    dateFormatString={dateFormatString}
                  />
                </ThreadSelectorContainer>
              )}
            </>
          );
        },
        [MessageEvent.RoomMessageEncrypted]: (mEvent, displayName) => {
          const eventId = mEvent.getId()!;
          const evtTimeline = room.getTimelineForEvent(eventId);

          return (
            <EncryptedContent mEvent={mEvent}>
              {() => {
                if (mEvent.isRedacted()) return <RedactedContent />;
                if (mEvent.getType() === MessageEvent.Sticker)
                  return (
                    <MSticker
                      content={mEvent.getContent()}
                      renderImageContent={(props) => (
                        <ImageContent
                          {...props}
                          autoPlay={mediaAutoLoad}
                          renderImage={(p) => <Image {...p} loading="lazy" />}
                          renderViewer={(p) => <ImageViewer {...p} />}
                        />
                      )}
                    />
                  );
                if (mEvent.getType() === MessageEvent.RoomMessage) {
                  const editedEvent =
                    evtTimeline && getEditedEvent(eventId, mEvent, evtTimeline.getTimelineSet());
                  const getContent = (() =>
                    editedEvent?.getContent()['m.new_content'] ??
                    mEvent.getContent()) as GetContentCallback;

                  return (
                    <RenderMessageContent
                      displayName={displayName}
                      msgType={mEvent.getContent().msgtype ?? ''}
                      ts={mEvent.getTs()}
                      edited={!!editedEvent || !!mEvent.replacingEvent()}
                      getContent={getContent}
                      mediaAutoLoad={mediaAutoLoad}
                      urlPreview={urlPreview}
                      htmlReactParserOptions={htmlReactParserOptions}
                      linkifyOpts={linkifyOpts}
                    />
                  );
                }
                if (mEvent.getType() === MessageEvent.RoomMessageEncrypted)
                  return (
                    <Text>
                      <MessageNotDecryptedContent />
                    </Text>
                  );
                return (
                  <Text>
                    <MessageUnsupportedContent />
                  </Text>
                );
              }}
            </EncryptedContent>
          );
        },
        [MessageEvent.Sticker]: (event, displayName, getContent) => {
          if (event.isRedacted()) {
            return (
              <RedactedContent reason={event.getUnsigned().redacted_because?.content.reason} />
            );
          }
          return (
            <MSticker
              content={getContent()}
              renderImageContent={(props) => (
                <ImageContent
                  {...props}
                  autoPlay={mediaAutoLoad}
                  renderImage={(p) => <Image {...p} loading="lazy" />}
                  renderViewer={(p) => <ImageViewer {...p} />}
                />
              )}
            />
          );
        },
      },
      undefined,
      (event) => {
        if (event.isRedacted()) {
          return <RedactedContent reason={event.getUnsigned().redacted_because?.content.reason} />;
        }
        return (
          <Box grow="Yes" direction="Column">
            <Text size="T400" priority="300">
              <code className={customHtmlCss.Code}>{event.getType()}</code>
              {' event'}
            </Text>
          </Box>
        );
      }
    );

    const handleOpen = (roomId: string, eventId: string) => {
      navigateRoom(roomId, eventId);
      requestClose();
    };

    return (
      <Menu ref={ref} className={css.ThreadsMenu}>
        <Box grow="Yes" direction="Column">
          <Header className={css.ThreadsMenuHeader} size="500">
            <Box grow="Yes">
              <Text size="H5">My Threads</Text>
            </Box>
            <Box shrink="No">
              <IconButton size="300" onClick={requestClose} radii="300">
                <Icon src={Icons.Cross} size="400" />
              </IconButton>
            </Box>
          </Header>
          <Box grow="Yes">
            <Scroll ref={scrollRef} size="300" hideTrack visibility="Hover">
              <Box className={css.ThreadsMenuContent} direction="Column" gap="100">
                {events && events.length > 0 ? (
                  <div
                    style={{
                      position: 'relative',
                      height: virtualizer.getTotalSize(),
                    }}
                  >
                    {virtualizer.getVirtualItems().map((vItem) => {
                      const event = events[vItem.index];
                      if (!event.getId()) return null;

                      return (
                        <VirtualTile
                          virtualItem={vItem}
                          style={{ paddingBottom: config.space.S200 }}
                          ref={virtualizer.measureElement}
                          key={vItem.index}
                        >
                          <SequenceCard
                            style={{ padding: config.space.S400, borderRadius: config.radii.R300 }}
                            variant="SurfaceVariant"
                            direction="Column"
                          >
                            <ThreadMessage
                              room={room}
                              event={event}
                              renderContent={renderMatrixEvent}
                              onOpen={handleOpen}
                              getMemberPowerTag={getMemberPowerTag}
                              accessibleTagColors={accessibleTagColors}
                              legacyUsernameColor={legacyUsernameColor || direct}
                              hour24Clock={hour24Clock}
                              dateFormatString={dateFormatString}
                            />
                          </SequenceCard>
                        </VirtualTile>
                      );
                    })}
                  </div>
                ) : (
                  <Box
                    className={ContainerColor({ variant: 'SurfaceVariant' })}
                    style={{
                      marginBottom: config.space.S200,
                      padding: `${config.space.S700} ${config.space.S400} ${toRem(60)}`,
                      borderRadius: config.radii.R300,
                    }}
                    grow="Yes"
                    direction="Column"
                    gap="400"
                    justifyContent="Center"
                    alignItems="Center"
                  >
                    <Icon src={Icons.Thread} size="600" />
                    <Box
                      style={{ maxWidth: toRem(300) }}
                      direction="Column"
                      gap="200"
                      alignItems="Center"
                    >
                      <Text size="H4" align="Center">
                        No Threads
                      </Text>
                      <Text size="T400" align="Center">
                        Threads you are participating in will appear here.
                      </Text>
                    </Box>
                  </Box>
                )}
              </Box>
            </Scroll>
          </Box>
        </Box>
      </Menu>
    );
  }
);
