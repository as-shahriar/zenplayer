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
    ratio: '16:9'
};

const PLAY_LIST_BUTTON = 'playlist-button';

export const VideoPlayer = (props: VideoProps) => {
    const { playlist, videoSrc, playNext, setPlaylist, updateProgress } = props;
    const ref = useRef<APITypes>(null);

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
            api.plyr.play();
        });
        api.plyr.on('ended', () => {
            updateProgress(api.plyr.duration, api.plyr.currentTime);
            playNext();
        });
        api.plyr.on('timeupdate', () => updateProgress(api.plyr.duration, api.plyr.currentTime));

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

    return (
        <div className={`video-container ${playlist ? 'show-playlist' : ''}`}>
            <video
                ref={raptorRef as React.MutableRefObject<HTMLVideoElement>}
                className="plyr-react plyr"
            />
        </div>
    );
};
