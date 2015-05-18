var React = require('react');

var Dropzone = React.createClass({
  getInitialState: function() {
    return {
      isDragActive: false,
      isChange: false,
      src: this.props.src
    }
  },

  propTypes: {
    onDrop: React.PropTypes.func.isRequired,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
    src: React.PropTypes.string
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.src != this.props.src) {
      this.setState({
        src: nextProps.src
      });
    }
  },

  onDragLeave: function(e) {
    this.setState({
      isDragActive: false
    });
  },

  onDragOver: function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    this.setState({
      isDragActive: true
    });
  },

  onDrop: function(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false,
      isChange: true
    });

    var files;

    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files);
      this.updatePreview(files);
    }
  },
  // @TODO: remove this to extends component.
  updatePreview: function (files) {
    var reader = new FileReader();
    var preview = this.refs.uploadPreview;

    reader.onload = function (e) {
      this.setState({
        src: e.target.result
      });

      this.props.onDrop(files, this.state.src);
    }.bind(this);

    reader.readAsDataURL(files[0]);
  },

  onClick: function () {
    this.refs.fileInput.getDOMNode().click();
  },

  render: function() {

    var className = this.props.className || 'dropzone';
    if (this.state.isDragActive) {
      className += ' active';
    };

    var style = this.props.style || {
      width: this.props.size || 100,
      height: this.props.size || 100,
      borderStyle: this.state.isDragActive ? "solid" : "dashed"
    };

    if (this.props.className) {
      style = this.props.style;
    }

    return (
      <div className={className} style={style} onClick={this.onClick} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <input style={{display: 'none' }} type='file' ref='fileInput' onChange={this.onDrop} />
        <div className="dropzone__preview">
          <i>{/* helper to vertical alignment. */}</i>
          <img ref={this.props.ref} src={this.state.src} />
        </div>
        { !this.state.src && this.props.children }
      </div>
    );
  }

});

module.exports = Dropzone;
