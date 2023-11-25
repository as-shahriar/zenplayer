import { EntityModel } from '../../../models/EntityModel';
import videoIcon from '../assets/icons/video.svg';
import './Playlist.scss';

type PlaylistProps = {
    videoList: EntityModel[];
    activeVideo: EntityModel | null;
    play: (id: number) => void;
};

export const Playlist = (props: PlaylistProps) => {
    const { videoList, activeVideo, play } = props;

    return (
        <div className="bg-white vh-100 playlist-container p-2">
            {videoList.map((video) => {
                return (
                    <button
                        key={video.id}
                        className={`btn btn-link text-decoration-none p-0 d-flex gap-1 ${
                            activeVideo?.id === video.id ? 'bg-info' : ''
                        }`}
                        onClick={() => play(video.id)}
                    >
                        <img src={videoIcon} alt="folder" />
                        <span className="d-grid">
                            <span className="text-start text-truncate">{video.name}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
