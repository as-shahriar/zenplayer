import * as React from 'react';
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { APITypes, PlyrInstance, PlyrSource, usePlyr } from 'plyr-react';
import { EntityModel } from '../../../models/EntityModel';
import playlistIcon from '../assets/icons/playlist.svg';
import './VideoPlayer.scss';

type VideoProps = {
    videoSrc: EntityModel | null;
    playlist: boolean;
    playNext: () => void;
    setPlaylist: Dispatch<SetStateAction<boolean>>;
    updateProgress: (total: number, current: number) => void;
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
    const { playlist, videoSrc, playNext, setPlaylist, updateProgress } = props;
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
        api.plyr.on('ready', () => console.log("I'm ready"));
        api.plyr.on('canplay', () => {
            if (
                videoSrc?.progress !== undefined &&
                api.plyr.duration !== 0 &&
                updateCurrentTimeRef.current
            ) {
                const seek = (api.plyr.duration * videoSrc.progress) / 100;
                console.log(Math.floor(seek));
                api.plyr.currentTime = seek;
                updateCurrentTimeRef.current = false;
            }

            api.plyr.play();
        });
        api.plyr.on('ended', () => {
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
    }, [videoSrc]);

    return (
        <div className={`video-container ${playlist ? 'show-playlist' : ''}`}>
            <video
                ref={raptorRef as React.MutableRefObject<HTMLVideoElement>}
                className="plyr-react plyr"
            />
        </div>
    );
};