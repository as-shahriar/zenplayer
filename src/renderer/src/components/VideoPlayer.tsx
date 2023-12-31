import * as React from 'react';
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { APITypes, PlyrInstance, PlyrSource, usePlyr } from 'plyr-react';
import { EntityModel } from '../../../models/EntityModel';
import playlistIcon from '../assets/icons/playlist.svg';
import './VideoPlayer.scss';
import { Icon } from './Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';

type VideoProps = {
    videoSrc: EntityModel | null;
    playlist: boolean;
    playNext: () => void;
    setPlaylist: Dispatch<SetStateAction<boolean>>;
    updateProgress: (total: number, current: number) => void;
    goBack: () => void;
};

const options = {
    ratio: '16:9',
    keyboard: { focused: true, global: true },
    invertTime: false,
    toggleInvert: true
};

const PLAY_LIST_BUTTON = 'playlist-button';

const shouldApplyProgress = (progress?: number) => {
    if (progress === undefined) return false;
    return progress > 0 && progress < 100;
};

export const VideoPlayer = (props: VideoProps) => {
    const { playlist, videoSrc, playNext, setPlaylist, updateProgress, goBack } = props;
    const ref = useRef<APITypes>(null);
    const videoProgress = useRef(0);
    const updateCurrentTimeRef = useRef<boolean>(false);

    const source: PlyrSource = useMemo(() => {
        return {
            type: 'video',
            title: 'Example title',
            sources: [
                {
                    src: 'file://' + videoSrc?.path || '',
                    type: 'video/mp4'
                }
            ]
        };
    }, [videoSrc?.path]);

    const raptorRef = usePlyr(ref, { options, source });

    useEffect(() => {
        const { current } = ref as React.MutableRefObject<APITypes>;
        if (current.plyr.source === null) return;
        const api = current as {
            plyr: PlyrInstance;
        };
        api.plyr.on('canplay', () => {
            if (
                videoSrc?.progress !== undefined &&
                api.plyr.duration !== 0 &&
                updateCurrentTimeRef.current
            ) {
                api.plyr.currentTime = (api.plyr.duration * videoSrc.progress) / 100;
                updateCurrentTimeRef.current = false;
            }

            api.plyr.play();
        });
        api.plyr.on('ended', () => {
            updateProgress(api.plyr.duration, api.plyr.currentTime);
            playNext();
        });
        api.plyr.on('timeupdate', () => {
            if (api.plyr.currentTime - videoProgress.current > 5) {
                videoProgress.current = api.plyr.currentTime;
                updateProgress(api.plyr.duration, api.plyr.currentTime);
            }
        });

        const controls = document.querySelector('.plyr__controls');
        if (!controls?.querySelector(`.${PLAY_LIST_BUTTON}`)) {
            const button = document.createElement('button');
            button.setAttribute(
                'class',
                `plyr__controls__item plyr__control d-flex align-items-center ${PLAY_LIST_BUTTON}`
            );
            button.onclick = () => {
                setPlaylist((e) => !e);
            };
            const img = document.createElement('img');
            img.src = playlistIcon;
            img.setAttribute('width', '18');
            button.appendChild(img);
            controls?.appendChild(button);
        }
    });

    useEffect(() => {
        updateCurrentTimeRef.current = shouldApplyProgress(videoSrc?.progress);
        videoProgress.current = 0;
    }, [videoSrc?.id]);

    useEffect(() => {
        let timeout: any;
        const element = document.querySelector('.topbar-container') as HTMLElement;
        const onMouseMove = () => {
            if (element?.classList.contains('hide')) {
                element?.classList.remove('hide');
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    element?.classList.add('hide');
                }, 2000);
            }
        };
        const onMouseOver = () => {
            clearTimeout(timeout);
            element?.classList.remove('hide');
        };

        const onMouseOut = () => {
            element?.classList.add('hide');
        };

        window.addEventListener('mousemove', onMouseMove);
        element?.addEventListener('mouseover', onMouseOver);
        element?.addEventListener('mouseout', onMouseOut);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', onMouseMove);
            element?.removeEventListener('mouseover', onMouseOver);
            element?.removeEventListener('mouseout', onMouseOut);
        };
    }, []);

    return (
        <div className={`video-container position-relative ${playlist ? 'show-playlist' : ''}`}>
            <video
                ref={raptorRef as React.MutableRefObject<HTMLVideoElement>}
                className="plyr-react plyr"
            />
            <div className="topbar-container hide w-100 position-absolute top-0 p-2">
                <button className="btn btn-back px-1 ms-1" onClick={goBack}>
                    <Icon
                        className="mt-n1 me-1"
                        iconSpritePath={iconDef}
                        name="left-arrow"
                        width={10}
                        height={10}
                    />
                    Back
                </button>
            </div>
        </div>
    );
};
