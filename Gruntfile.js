// vim: et sw=2 ts=2
/* global module, require */

const fs = require('fs');
const path = require('path');


function assert_exists(file) {
    if (!fs.existsSync(file)) {
        throw new Error(`File not found: ${file}`);
    }
    return file;
}

function add_prefix(left, right) {
    return assert_exists(path.join(left, right));
}


module.exports = function(grunt) {
  'use strict';

  const dist = 'dist';
  const static_dist = `${dist}/static`;

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  try {
    grunt.loadNpmTasks('grunt-contrib-watch');
  } catch(e) {
    console.warn("Grunt 'watch' is not available");
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      app_deps: {
        src: [
          "jquery/dist/jquery.js",
          "long/dist/long.js",
          "bytebuffer/dist/ByteBufferAB.js",
          "protobuf/dist/ProtoBuf.js",
          "handlebars/handlebars.js",
          "underscore/underscore.js",
          "backbone/backbone.js",
          "qrcode/qrcode.js",
          "moment/min/moment-with-locales.js",
          "../lib/backbone-indexeddb.js",
          "blueimp-load-image/js/load-image.all.min.js",
          "blueimp-md5/js/md5.min.js",  // Cleaner than !min version
          "emojijs/lib/emoji.js",
          "jquery-oembed-all/jquery.oembed.js",
          "dompurify/dist/purify.js",
          "platform.js/platform.js",
          "../lib/forstadown.js",
          "../lib/async_queue.js",
          "raven-js/dist/raven.js"  // Ensure this is last.
        ].map(x => add_prefix('components', x)),
        dest: `${static_dist}/js/app/deps.js`
      },

      worker_deps: {
        src: [
          "long/dist/long.js",
          "bytebuffer/dist/ByteBufferAB.js",
          "protobuf/dist/ProtoBuf.js",
          "underscore/underscore.js",
          "backbone/backbone.js",
          "../lib/backbone-indexeddb.js",
          "blueimp-md5/js/md5.min.js",  // Cleaner than !min version
          "../lib/async_queue.js",
          "raven-js/dist/raven.js"  // Ensure this is last.
        ].map(x => add_prefix('components', x)),
        dest: `${static_dist}/js/worker/deps.js`
      },

      lib_relay: {
        src: [
          'init.js',
          'errors.js',
          'crypto.js',
          'protobufs.js',
          'queue_async.js',
          'websocket-resources.js',
          'util.js',
          'hub.js',
          'event_target.js',
          'account_manager.js',
          'message_receiver.js',
          'message_sender.js',
          'outgoing_message.js',
          'ProvisioningCipher.js',
        ].map(x => add_prefix('node_modules/librelay-web/src', x)),
        dest: `${static_dist}/js/lib/relay.js`
      },

      app_main: {
        src: [
          'ga.js',
          'version.js',
          'database.js',
          'cache.js',
          'util.js',
          'templates.js',
          'atlas.js',
          'state.js',
          'store.js',
          'service_worker.js',
          'notifications.js',
          'models/atlas.js',
          'models/users.js',
          'models/org.js',
          'models/tags.js',
          'models/receipts.js',
          'models/messages.js',
          'models/threads.js',
          'models/state.js',
          'emoji.js',
          'router.js',
          'views/base.js',
          'views/header.js',
          'views/file_input.js',
          'views/list.js',
          'views/nav.js',
          'views/attachment.js',
          'views/timestamp.js',
          'views/message.js',
          'views/thread.js',
          'views/conversation.js',
          'views/announcement.js',
          'views/compose.js',
          'views/new_thread.js',
          'views/main.js',
          'views/giphy.js',
          'views/phone_suggestion.js',
          'easter.js',
          'foundation.js',
          'main.js'
        ].map(x => add_prefix('app', x)),
        dest: `${static_dist}/js/app/main.js`
      },

      app_install: {
        src: [
          'ga.js',
          'version.js',
          'database.js',
          'cache.js',
          'util.js',
          'templates.js',
          'atlas.js',
          'state.js',
          'store.js',
          'models/atlas.js',
          'models/users.js',
          'models/org.js',
          'models/tags.js',
          'models/messages.js',
          'models/threads.js',
          'models/state.js',
          'views/base.js',
          'views/header.js',
          'views/install.js',
          'easter.js',
          'foundation.js',
          'install.js'
        ].map(x => add_prefix('app', x)),
        dest: `${static_dist}/js/app/install.js`
      },

      worker_service: {
        src: [
          'worker/service/imports.js',
          'app/version.js',
          'app/database.js',
          'app/cache.js',
          'app/util.js',
          'app/templates.js',
          'app/atlas.js',
          'app/state.js',
          'app/store.js',
          'app/notifications.js',
          'app/models/atlas.js',
          'app/models/users.js',
          'app/models/org.js',
          'app/models/tags.js',
          'app/models/receipts.js',
          'app/models/messages.js',
          'app/models/threads.js',
          'app/models/state.js',
          'app/foundation.js',
          'worker/service/main.js'
        ].map(assert_exists),
        dest: `${static_dist}/js/worker/service.js`
      },

      worker_shared: {
        src: [
          'worker/shared/main.js'
        ].map(assert_exists),
        dest: `${static_dist}/js/worker/shared.js`
      }
    },

    uglify: {
      options: {
        output: {
          max_line_len: undefined
        }
      },

      app_deps: {
        files: [{
          src: `${static_dist}/js/app/deps.js`,
          dest: `${static_dist}/js/app/deps.min.js`
        }]
      },

      worker_deps: {
        files: [{
          src: [`${static_dist}/js/worker/deps.js`],
          dest: `${static_dist}/js/worker/deps.min.js`
        }]
      },

      lib_relay: {
        files: [{
          src: [`${static_dist}/js/lib/relay.js`],
          dest: `${static_dist}/js/lib/relay.min.js`
        }]
      },

      app_main: {
        files: [{
          src: [`${static_dist}/js/app/main.js`],
          dest: `${static_dist}/js/app/main.min.js`
        }]
      },

      app_install: {
        files: [{
          src: [`${static_dist}/js/app/install.js`],
          dest: `${static_dist}/js/app/install.min.js`
        }]
      },

      worker_service: {
        files: [{
          src: [`${static_dist}/js/worker/service.js`],
          dest: `${static_dist}/js/worker/service.min.js`
        }]
      },

      worker_shared: {
        files: [{
          src: [`${static_dist}/js/worker/shared.js`],
          dest: `${static_dist}/js/worker/shared.min.js`
        }]
      }
    },

    sass: {
      stylesheets: {
        options: {
            sourcemap: 'inline'
        },
        files: [{
          expand: true,
          cwd: 'stylesheets',
          src: ['*.scss'],
          dest: `${static_dist}/stylesheets`,
          ext: '.css'
        }]
      }
    },

    copy: {
      root: {
        nonull: true,
        files: [{
          expand: true,
          src: ['html/**'],
          dest: dist
        }]
      },

      static: {
        nonull: true,
        files: [{
          expand: true,
          src: [
            'images/**',
            'audio/**',
            'fonts/**',
            'templates/**',
            'manifest.json',
          ],
          dest: static_dist
        }, {
          expand: true,
          cwd: 'components/emoji-data/',
          src: ['img-google-136/**'],
          dest: `${static_dist}/images/emoji`
        }, {
          expand: true,
          cwd: 'node_modules/librelay-web/',
          src: ['protos/**'],
          dest: static_dist
        }]
      },

      semantic: {
        nonull: true,
        files: [{
          expand: true,
          cwd: 'semantic/dist',
          src: ['**'],
          dest: `${static_dist}/semantic`
        }]
      },

      libsignal: {
        nonull: true,
        files: [{
          src: 'node_modules/libsignal-protocol/dist/libsignal-protocol.js',
          dest: `${static_dist}/js/lib/signal.js`
        }, {
          src: 'node_modules/libsignal-protocol/dist/libsignal-protocol.min.js',
          dest: `${static_dist}/js/lib/signal.min.js`
        }]
      }
    },

    watch: {
      stylesheets: {
        files: [
          'stylesheets/*.scss',
        ],
        tasks: ['sass']
      },
      code: {
        files: [
          'node_modules/librelay-web/src/**',
          'lib/**',
          'app/**',
          'worker/**',
          'Gruntfile.js'
        ],
        tasks: ['concat', 'copy']
      },
      html: {
        files: [
          'protos/**',
          'images/**',
          'audio/**',
          'fonts/**',
          'templates/**',
          'html/**'
        ],
        tasks: ['copy']
      }
    }
  });

  grunt.registerTask('default', ['concat', 'uglify', 'sass', 'copy']);
};
