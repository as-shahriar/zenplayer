import Plyr from 'plyr-react';
import './Video.scss';
import { useEffect } from 'react';

type VideoProps = {
    videoSrc: string;
    playlist: boolean;
};

export const Video = (props: VideoProps) => {
    const { videoSrc, playlist } = props;

    useEffect(() => {
        let timeOut;
        if (videoSrc) {
            timeOut = setTimeout(() => {
                return (document.querySelector('.plyr__controls__item') as HTMLElement)?.focus();
            }, 100);
        }
        return () => {
            clearTimeout(timeOut);
        };
    }, [videoSrc]);

    return (
        <div className={`video-container ${playlist ? 'show-playlist' : ''}`}>
            <Plyr
                source={{
                    type: 'video',
                    title: 'Example title',
                    sources: [
                        {
                            src: 'file://' + videoSrc,
                            type: 'video/mp4'
                        }
                    ]
                }}
                options={{ autoplay: true, ratio: '16:9' }}
            />
        </div>
    );
};
