import { EntityModel } from '../../../models/EntityModel';
import './Playlist.scss';
import { Icon } from './Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';
import { EntityType } from '../../../models/enums/EntityType';
import { clsx } from 'clsx';

type PlaylistProps = {
    videoList: EntityModel[];
    activeVideo: EntityModel | null;
    play: (id: number) => void;
};

export const Playlist = (props: PlaylistProps) => {
    const { videoList, activeVideo, play } = props;

    return (
        <div className="vh-100 playlist-container p-2 overflow-y-auto">
            {videoList
                .filter((item) => item.type === EntityType.Video)
                .map((video) => {
                    return (
                        <button
                            key={video.id}
                            title={video.name}
                            className={clsx(
                                'playlist-item btn px-2 py-1 mb-1 position-relative',
                                activeVideo?.id === video.id && 'active'
                            )}
                            onClick={() => play(video.id)}
                        >
                            <Icon
                                iconSpritePath={iconDef}
                                name="video"
                                width={28}
                                height={28}
                                className="me-2"
                            />
                            {video.progress !== 0 && video.progress !== 100 && (
                                <div className="progress-container">
                                    <div
                                        className="progress"
                                        style={{ width: `${video.progress}%` }}
                                    ></div>
                                </div>
                            )}

                            {video.progress === 100 && (
                                <div className="check position-absolute">
                                    <Icon
                                        iconSpritePath={iconDef}
                                        name="check"
                                        width={8}
                                        height={8}
                                    />
                                </div>
                            )}
                            <span className="playlist-item-text text-truncate d-inline-block align-middle">
                                {video.name}
                            </span>
                        </button>
                    );
                })}
        </div>
    );
};
