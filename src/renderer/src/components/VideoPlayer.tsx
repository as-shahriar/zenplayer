import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { APITypes, PlyrInstance, usePlyr, PlyrSource } from 'plyr-react';
import { EntityModel } from '../../../models/EntityModel';
import './VideoPlayer.scss';

type VideoProps = {
    videoSrc: EntityModel | null;
    playlist: boolean;
    playNext: () => void;
};

const options = {
    ratio: '16:9'
};

export const VideoPlayer = (props: VideoProps) => {
    const { playlist, videoSrc, playNext } = props;
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

        const api = current as { plyr: PlyrInstance };
        api.plyr.on('ready', () => console.log("I'm ready"));
        api.plyr.on('canplay', () => {
            api.plyr.play();
            console.log('duration of audio is', api.plyr.duration);
        });
        api.plyr.on('ended', playNext);
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
