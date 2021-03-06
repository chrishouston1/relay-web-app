// vim: ts=4:sw=4:expandtab
/* global Backbone */

(function () {
    'use strict';

    self.F = self.F || {};

    const opMethods = {
        'create': 'POST',
        'update': 'PUT',
        'patch': 'PATCH',
        'delete': 'DELETE',
        'read': 'GET'
    };

    const syncMixin = {
        sync: async function(op, obj, options) {
            const params = {
                method: opMethods[op]
            };
            if (options.data) {
                params.body = options.data;
            } else if (obj && (op === 'create' || op === 'update' || op === 'patch')) {
                params.json = options.attrs || obj.toJSON(options);
            }
            let result;
            let fetchAtlas;
            if (op === 'read' && this.readCacheTTL) {
                fetchAtlas = F.cache.ttl(this.readCacheTTL, F.atlas.fetch);
            } else {
                fetchAtlas = F.atlas.fetch;
            }
            try {
                result = await fetchAtlas(this.getURN(), params);
            } catch(e) {
                if (options.error) {
                    options.error.call(options.context, e);
                }
                throw e;
            }
            if (options.success) {
                options.success.call(options.context, result);
            }
        }
    };

    F.AtlasModel = Backbone.Model.extend(_.extend({
        getURN: function() {
            return this.urn + this.id + '/';
        }
    }, syncMixin));

    F.AtlasCollection = Backbone.Collection.extend(_.extend({
        getURN: function() {
            return this.urn;
        },

        parse: function(resp, options) {
            return resp.results;
        }
    }, syncMixin));
})();
