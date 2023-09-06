import "react-dropzone-uploader/dist/styles.css";
import Dropzone, { IFileWithMeta, ILayoutProps } from "react-dropzone-uploader";
import { config } from "config";
import ToasterService from "utils/toaster.util";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import AuthService from "services/auth.service";
import ImageService from "services/image.service";
import { backgroundActions } from "redux/slices/background";
//@ts-ignore
import cancelImg from 'assets/remove.svg'
//@ts-ignore
import removeImg from 'assets/remove.svg'
//@ts-ignore
import restartImg from 'assets/restart.png'

const iconByFn = {
  cancel: { backgroundImage: `url(${cancelImg})` },
  remove: { backgroundImage: `url(${removeImg})` },
  restart: { backgroundImage: `url(${restartImg})` },
};

const Layout = ({
  input,
  previews,
  dropzoneProps,
  files,
  extra: { maxFiles },
}: ILayoutProps) => {
  return (
    <div className="dropzone-flex">
      <div {...dropzoneProps}>
        {previews}
        {files.length < maxFiles && input}
      </div>
    </div>
  );
};

export default function MusicDropZone({ musicType }: any) {

  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const getUploadParams = async ({ file }: IFileWithMeta) => {
    const body = new FormData();
    body.append("image", file);
    return { url: `${config.API_URL}/guest/upload`, body };
  };

  const handleChangeStatus = ({ meta, remove }: any, status: any) => {
    if (status === "headers_received") {
      let music = `uploads/${meta.name}`;
      if (user) {
        if (musicType === "private") AuthService.music(music, dispatch);
        else {
          ImageService.backgroundMusic(music, dispatch);
          dispatch(backgroundActions.setPlay(true));
        }
      } else {
        ImageService.backgroundMusic(music, dispatch);
        dispatch(backgroundActions.setPlay(true));
      }
      remove();
      ToasterService.showSuccess(`${meta.name} uploaded`);
    } else if (status === "aborted") {
      ToasterService.showError(`${meta.name} upload failed`);
    }
  };

  const formatBytes = (b: number) => {
    const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let l = 0
    let n = b

    while (n >= 1024) {
      n /= 1024
      l += 1
    }

    return `${n.toFixed(n >= 10 || l < 1 ? 0 : 1)}${units[l]}`
  }

  const formatDuration = (seconds: number) => {
    const date = new Date(0)
    date.setSeconds(seconds)
    const dateString = date.toISOString().slice(11, 19)
    if (seconds < 3600) return dateString.slice(3)
    return dateString
  }

  const renderPreview = (props: any) => {
    const {
      className,
      imageClassName,
      style,
      imageStyle,
      fileWithMeta: { cancel, remove, restart, file },
      meta: { name = '', percent = 0, size = 0, previewUrl, status, duration, validationError, type },
      isUpload,
      canCancel,
      canRemove,
      canRestart,
      extra: { minSizeBytes },
    } = props;
    console.log(props);

    let title = `${name || '?'}, ${formatBytes(size)}`
    if (duration) title = `${title}, ${formatDuration(duration)}`

    if (status === 'error_file_size' || status === 'error_validation') {
      return (
        <div className={className} style={style}>
          <span className="dzu-previewFileNameError">{title}</span>
          {status === 'error_file_size' && <span>{size < minSizeBytes ? 'File too small' : 'File too big'}</span>}
          {status === 'error_validation' && <span>{String(validationError)}</span>}
          {canRemove && <span className="dzu-previewButton" style={iconByFn.remove} onClick={remove} />}
        </div>
      )
    }

    if (status === 'error_upload_params' || status === 'exception_upload' || status === 'error_upload') {
      title = `${title} (upload failed)`
    }
    if (status === 'aborted') title = `${title} (cancelled)`

    return (
      <div className={className} style={style}>
        {previewUrl && <img className={imageClassName} style={imageStyle} src={previewUrl} alt={title} title={title} />}
        {!previewUrl && type.startsWith('video/') && (<video width="100" height="100" autoPlay>
          <source src={URL.createObjectURL(file)} type={type} />
          Your browser does not support the video tag.
        </video>)}
        <span className="dzu-previewFileName">{title}</span>
        {/* {!previewUrl && <span className="dzu-previewFileName">{title}</span>} */}

        <div className="dzu-previewStatusContainer">
          {isUpload && (
            <progress max={100} value={status === 'done' || status === 'headers_received' ? 100 : percent} />
          )}

          {status === 'uploading' && canCancel && (
            <span className="dzu-previewButton" style={iconByFn.cancel} onClick={cancel} />
          )}
          {status !== 'preparing' && status !== 'getting_upload_params' && status !== 'uploading' && canRemove && (
            <span className="dzu-previewButton" style={iconByFn.remove} onClick={remove} />
          )}
          {['error_upload_params', 'exception_upload', 'error_upload', 'aborted', 'ready'].includes(status) &&
            canRestart && <span className="dzu-previewButton" style={iconByFn.restart} onClick={restart} />}
        </div>
      </div>
    )
  };

  return (
    <Dropzone
      LayoutComponent={Layout}
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      accept={"audio/*"}
      maxFiles={1}
      multiple={false}
      canCancel={false}
      PreviewComponent={renderPreview}
      inputContent={
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "normal",
              textTransform: "capitalize",
              paddingTop: '2px',
              userSelect: 'text',
              overflow: 'hidden',
            }}
          >
            Upload Music
          </p>
        </div>
      }
      styles={{
        dropzone: {
          minHeight: 100,
          maxHeight: 100,
          borderRadius: 0,
          overflow: "unset",
          color: "white",
          background: "transparent",
        },
      }}
    />
  );
}
