import { Folder } from './Folder';
import addFolderIcon from '../assets/icons/add-folder.svg';
import { ApiKey } from '../../../constants/appConstants';
import { useEffect, useState } from 'react';
import { EntityModel } from '../../../models/EntityModel';
import { useParams } from 'react-router-dom';
import 'plyr-react/plyr.css';
import Plyr from 'plyr-react';

type WatchListProps = {};

export const WatchList = (props: WatchListProps) => {
    const {} = props;
    const [entity, setEntity] = useState<EntityModel[]>([]);
    const [videoSrc, setVideoSrc] = useState<string>('');
    const { id } = useParams();
    const getNewFolder = () => {
        window[ApiKey].selectFolder().then(() => {
            getAll();
        });
    };
    const getAll = () => {
        window[ApiKey].getRootFolders().then((result: EntityModel[]) => {
            setEntity(result);
        });
    };

    useEffect(() => {
        if (id) {
            window[ApiKey].getChildren(id).then((result: EntityModel[]) => {
                setEntity(result);
            });
        } else {
            getAll();
        }
    }, [id]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <span>Watch List</span>
                <button className="btn" onClick={getNewFolder}>
                    <img src={addFolderIcon} className="mt-n1 me-2" alt="add-folder" width={22} />
                    New Folder
                </button>
            </div>
            <div className="mt-4 d-flex flex-wrap gap-4">
                {entity.map((item) => (
                    <>
                        <button
                            className="btn btn-link"
                            onClick={() => {
                                if (!item.directory) setVideoSrc(item.path);
                            }}
                        >
                            Play
                        </button>
                        <Folder key={item.id} title={item.name} id={item.id} />
                    </>
                ))}
            </div>

            {videoSrc && (
                <Plyr
                    source={{
                        type: 'video',
                        title: 'Example title',
                        sources: [
                            {
                                // src: 'atom:///home/asif/Downloads/01 - Getting Started/001 Welcome to the Course.mp4',
                                src: 'file://' + videoSrc,
                                // src:"https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",

                                type: 'video/mp4',
                                size: 720
                            }
                        ]
                    }}
                    options={{ autoplay: true }}
                />
                // <video width="320" height="240" controls>
                //     <source src={'file://' + videoSrc} type="video/mp4" />
                //     Your browser does not support the video tag.
                // </video>
            )}
        </div>
    );
};
