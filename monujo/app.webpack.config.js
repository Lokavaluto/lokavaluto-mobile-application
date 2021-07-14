// @ts-ignore
const NsVueTemplateCompiler = require('nativescript-vue-template-compiler');
NsVueTemplateCompiler.registerElement('MDTextField', () => require('@nativescript-community/ui-material-textfield').TextField, {
    model: {
        prop: 'text',
        event: 'textChange'
    }
});
NsVueTemplateCompiler.registerElement('MDSlider', () => require('@nativescript-community/ui-material-slider').Slider, {
    model: {
        prop: 'value',
        event: 'valueChange'
    }
});
NsVueTemplateCompiler.registerElement('Pager', () => require('@nativescript-community/ui-pager').Pager, {
    model: {
        prop: 'selectedIndex',
        event: 'selectedIndexChange'
    }
});
NsVueTemplateCompiler.registerElement('BottomSheet', () => require('@nativescript-community/ui-persistent-bottomsheet').Pager, {
    model: {
        prop: 'stepIndex',
        event: 'stepIndexChange'
    }
});
const webpackConfig = require('./webpack.config.js');
const webpack = require('webpack');
const { readFileSync, readdirSync } = require('fs');
// @ts-ignore
const { dirname, join, relative, resolve, sep } = require('path');
const nsWebpack = require('@nativescript/webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
// @ts-ignore
const TerserPlugin = require('terser-webpack-plugin');
// @ts-ignore
const CopyWebpackPlugin = require('copy-webpack-plugin');
// @ts-ignore
const Fontmin = require('@akylas/fontmin');
const IgnoreNotFoundExportPlugin = require('./IgnoreNotFoundExportPlugin');
const camelCase = require('camelcase');
function fixedFromCharCode(codePt) {
    if (codePt > 0xffff) {
        codePt -= 0x10000;
        return String.fromCharCode(0xd800 + (codePt >> 10), 0xdc00 + (codePt & 0x3ff));
    } else {
        return String.fromCharCode(codePt);
    }
}
module.exports = (env, params = {}) => {
    if (env.adhoc) {
        env = Object.assign(
            {},
            {
                production: true,
                sentry: true,
                uploadSentry: true,
                sourceMap: true,
                uglify: true
            },
            env
        );
    }
    const nconfig = require('./nativescript.config');
    const {
        appPath = nconfig.appPath,
        appResourcesPath = nconfig.appResourcesPath,
        // @ts-ignore
        hmr, // --env.hmr
        production, // --env.production
        sourceMap, // --env.sourceMap
        hiddenSourceMap, // --env.hiddenSourceMap
        inlineSourceMap, // --env.inlineSourceMap
        sentry, // --env.sentry
        uploadSentry,
        // @ts-ignore
        verbose, // --env.verbose
        uglify, // --env.uglify
        noconsole, // --env.noconsole
        devlog, // --env.devlog
        fakeall, // --env.fakeall
        adhoc // --env.adhoc
    } = env;

    env.appPath = appPath;
    env.appResourcesPath = appResourcesPath;
    // env.appComponents = env.appComponents || [];
    // env.appComponents.push('~/services/android/BgService', '~/services/android/BgServiceBinder');
    // @ts-ignore
    const config = webpackConfig(env, params);
    const mode = production ? 'production' : 'development';
    const platform = env && ((env.android && 'android') || (env.ios && 'ios'));
    const tsconfig = 'tsconfig.json';
    const projectRoot = params.projectRoot || __dirname;
    const dist = nsWebpack.Utils.platform.getDistPath();
    const appResourcesFullPath = resolve(projectRoot, appResourcesPath);

    // @ts-ignore
    config.externals.push('~/licenses.json');
    // @ts-ignore
    config.externals.push(function ({ context, request }, cb) {
        if (/i18n$/i.test(context)) {
            return cb(null, './i18n/' + request);
        }
        cb();
    });
    const coreModulesPackageName = '@akylas/nativescript';
    config.resolve.modules = [resolve(__dirname, `node_modules/${coreModulesPackageName}`), resolve(__dirname, 'node_modules'), `node_modules/${coreModulesPackageName}`, 'node_modules'];
    Object.assign(config.resolve.alias, {
        '@nativescript/core': `${coreModulesPackageName}`,
        'tns-core-modules': `${coreModulesPackageName}`
    });

    // @ts-ignore
    const package = require('./package.json');
    const isIOS = platform === 'ios';
    const isAndroid = platform === 'android';
    const APP_STORE_ID = process.env.IOS_APP_ID;
    const CUSTOM_URL_SCHEME = 'lokavaluto';
    const APP_TRANSFER_QRCODE = 'transfer';
    const APP_TRANSFER_QRCODE_PARAMS = '%(ICC)s#%(id)s#%(name)s';
    const APP_TRANSFER_QRCODE_AMOUNT_PARAM = '#%(amount)s';
    const locales = readdirSync(join(projectRoot, appPath, 'i18n'))
        .filter((s) => s.endsWith('.json'))
        .map((s) => s.replace('.json', ''));
    console.log('locales', locales);
    const defines = {
        PRODUCTION: !!production,
        NO_CONSOLE: noconsole,
        process: 'global.process',
        'global.TNS_WEBPACK': 'true',
        'gVars.platform': `"${platform}"`,
        'global.isIOS': isIOS,
        'global.isAndroid': isAndroid,
        'gVars.internalApp': false,
        SUPPORTED_LOCALES: JSON.stringify(locales),
        TNS_ENV: JSON.stringify(mode),
        'gVars.sentry': !!sentry,
        DEV_LOGIN_MAIL: `"${process.env.MONUJO_DEV_LOGIN_MAIL}"`,
        DEV_LOGIN_PASSWORD: `"${process.env.MONUJO_DEV_LOGIN_PASSWORD}"`,
        SENTRY_DSN: `"${process.env.SENTRY_DSN}"`,
        APP_HOST: `"${process.env.APP_HOST}"`,
        APP_DB: `"${process.env.APP_DB}"`,
        APP_CLIENT_ID: `"${process.env.APP_CLIENT_ID}"`,
        APP_CLIENT_SECRET: `"${process.env.APP_CLIENT_SECRET}"`,
        APP_SMS_NUMBER: `"${process.env.APP_SMS_NUMBER}"`,
        SHA_SECRET_KEY: `"${process.env.APP_SHA_SECRET_KEY}"`,
        SENTRY_PREFIX: `"${!!sentry ? process.env.SENTRY_PREFIX : ''}"`,
        GIT_URL: `"${package.repository}"`,
        SUPPORT_URL: `"${package.bugs.url}"`,
        TERMS_CONDITIONS_URL: `"${process.env.TERMS_CONDITIONS_URL}"`,
        PRIVACY_POLICY_URL: `"${process.env.PRIVACY_POLICY_URL}"`,
        CUSTOM_URL_SCHEME: `"${CUSTOM_URL_SCHEME}"`,
        APP_TRANSFER_QRCODE: `"${APP_TRANSFER_QRCODE}"`,
        APP_TRANSFER_QRCODE_PARAMS: `"${APP_TRANSFER_QRCODE_PARAMS}"`,
        APP_TRANSFER_QRCODE_AMOUNT_PARAM: `"${APP_TRANSFER_QRCODE_AMOUNT_PARAM}"`,
        APP_FULL_QRCODE_FORMAT: `"${`${CUSTOM_URL_SCHEME}://${APP_TRANSFER_QRCODE}/${APP_TRANSFER_QRCODE_PARAMS}`}"`,
        CREDIT_URL: '""',
        STORE_LINK: `"${isAndroid ? `https://play.google.com/store/apps/details?id=${nconfig.id}` : `https://itunes.apple.com/app/id${APP_STORE_ID}`}"`,
        STORE_REVIEW_LINK: `"${
            isIOS
                ? ` itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=${APP_STORE_ID}&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software`
                : `market://details?id=${nconfig.id}`
        }"`,
        LOG_LEVEL: devlog ? '"full"' : '""',
        FAKE_ALL: fakeall,
        TEST_LOGS: adhoc || !production,
        WITH_PUSH_NOTIFICATIONS: 'true'
    };

    const symbolsParser = require('scss-symbols-parser');
    const mdiSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'node_modules/@mdi/font/scss/_variables.scss')).toString());
    const mdiIcons = JSON.parse(`{${mdiSymbols.variables[mdiSymbols.variables.length - 1].value.replace(/" (F|0)(.*?)([,\n]|$)/g, '": "$1$2"$3')}}`);
    const appSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'css/variables.scss')).toString());
    const appVariables = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, appPath, 'common/variables.scss')).toString()).variables.reduce(function (acc, current) {
        acc[camelCase(current.name.slice(1))] = current.value;
        return acc;
    }, {});
    const appIcons = {};
    appSymbols.variables
        .filter((v) => v.name.startsWith('$icon-'))
        .forEach((v) => {
            appIcons[v.name.replace('$icon-', '')] = String.fromCharCode(parseInt(v.value.slice(2), 16));
        });
    const scssPrepend = `$lato-fontFamily: ${isAndroid ? 'res/lato' : 'Lato'};
    $app-fontFamily: app;
    $roboto-fontFamily: ${isAndroid ? 'roboto' : 'Roboto'};
    $mdi-fontFamily: ${isAndroid ? 'materialdesignicons-webfont' : 'Material Design Icons'};
    `;

    // @ts-ignore
    const scssLoaderRuleIndex = config.module.rules.findIndex((r) => r.test && r.test.toString().indexOf('scss') !== -1);
    config.module.rules.splice(
        scssLoaderRuleIndex,
        1,
        {
            test: /\.scss$/,
            exclude: /\.module\.scss$/,
            use: [
                { loader: 'apply-css-loader' },
                {
                    loader: 'css2json-loader',
                    options: { useForImports: true }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        additionalData: scssPrepend
                    }
                }
            ]
        },
        {
            test: /\.module\.scss$/,
            use: [
                { loader: 'css-loader', options: { url: false } },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        additionalData: scssPrepend
                    }
                }
            ]
        }
    );

    const usedMDIICons = [];
    config.module.rules.push({
        // rules to replace mdi icons and not use nativescript-font-icon
        test: /\.(ts|js|scss|css|vue)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'mdi-([a-z0-9-_]+)',
                    // @ts-ignore
                    replace: (match, p1, offset, str) => {
                        if (mdiIcons[p1]) {
                            const unicodeHex = mdiIcons[p1];
                            const numericValue = parseInt(unicodeHex, 16);
                            const character = fixedFromCharCode(numericValue);
                            usedMDIICons.push(numericValue);
                            return character;
                        }
                        return match;
                    },
                    flags: 'g'
                }
            },
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'app-([a-zA-Z0-9-_]+)',
                    // @ts-ignore
                    replace: (match, p1, offset) => {
                        if (appIcons[p1]) {
                            return appIcons[p1];
                        }
                        return match;
                    },
                    flags: 'g'
                }
            }
        ]
    });

    if (!!production) {
        config.module.rules.push({
            // rules to replace mdi icons and not use nativescript-font-icon
            test: /\.(js)$/,
            use: [
                {
                    loader: 'string-replace-loader',
                    options: {
                        search: '__decorate\\(\\[((.|\n)*?)profile,((.|\n)*?)\\],.*?,.*?,.*?\\);?',
                        // @ts-ignore
                        replace: (match, p1, offset, str) => '',
                        flags: 'g'
                    }
                }
            ]
        });
        // rules to clean up all Trace in production
        // we must run it for all files even node_modules
        config.module.rules.push({
            test: /\.(ts|js)$/,
            use: [
                {
                    loader: 'string-replace-loader',
                    options: {
                        search: 'if\\s*\\(\\s*Trace.isEnabled\\(\\)\\s*\\)',
                        replace: 'if (false)',
                        flags: 'g'
                    }
                }
            ]
        });
    }

    // config.plugins.push(
    //     new webpack.ProvidePlugin({
    //         Buffer: ['buffer', 'Buffer']
    //     })
    // );
    // handle node polyfills
    config.externalsPresets = { node: false };
    config.resolve.fallback = config.resolve.fallback || {};
    config.resolve.fallback.buffer = require.resolve('url/');

    // config.plugins.push(
    //     new webpack.ProvidePlugin({
    //         URLSearchParams: '@ungap/url-search-params'
    //     })
    // );

    // we remove default rules
    config.plugins = config.plugins.filter((p) => ['CopyPlugin', 'ForkTsCheckerWebpackPlugin'].indexOf(p.constructor.name) === -1);
    // we add our rules
    const globOptions = { dot: false, ignore: [`**/${relative(appPath, appResourcesFullPath)}/**`] };
    const context = nsWebpack.Utils.platform.getEntryDirPath();
    const copyPatterns = [
        { context, from: 'fonts/!(ios|android)/**/*', to: 'fonts/[name][ext]', noErrorOnMissing: true, globOptions },
        { context, from: 'fonts/*', to: 'fonts/[name][ext]', noErrorOnMissing: true, globOptions },
        { context, from: `fonts/${platform}/**/*`, to: 'fonts/[name][ext]', noErrorOnMissing: true, globOptions },
        { context, from: '**/*.jpg', noErrorOnMissing: true, globOptions },
        { context, from: '**/*.png', noErrorOnMissing: true, globOptions },
        { context, from: 'assets/**/*', noErrorOnMissing: true, globOptions },
        { context, from: 'i18n/**/*', globOptions },
        {
            from: 'node_modules/@mdi/font/fonts/materialdesignicons-webfont.ttf',
            to: 'fonts',
            globOptions,
            transform: {
                transformer(content, path) {
                    return new Promise((resolve, reject) => {
                        new Fontmin()
                            .src(content)
                            // @ts-ignore
                            .use(Fontmin.glyph({ subset: usedMDIICons }))
                            .run(function (err, files) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(files[0].contents);
                                }
                            });
                    });
                }
            }
        }
    ];
    if (isAndroid) {
        copyPatterns.push({
            context: `${appResourcesPath}/Android/src/main/res`,
            from: '**/colors.xml',
            to: '../../res',
            globOptions: { dot: false },
            transform: {
                transformer(content, path) {
                    return content.toString().replace(/<color name="(.*)">(.*)<\/color>/gm, function (match, p1, p2, offset, str) {
                        if (appVariables[p1]) {
                            return `<color name="${p1}">${appVariables[p1]}<\/color>`;
                        }
                        return match;
                    });
                }
            }
        });
    }
    config.plugins.unshift(new CopyWebpackPlugin({ patterns: copyPatterns }));
    config.plugins.push(new IgnoreNotFoundExportPlugin());
    // @ts-ignore
    Object.assign(config.plugins.find((p) => p.constructor.name === 'DefinePlugin').definitions, defines);
    config.plugins.push(new webpack.ContextReplacementPlugin(/dayjs[\/\\]locale$/, new RegExp(`(${locales.join('|')})$`)));
    if (nconfig.cssParser !== 'css-tree') {
        // @ts-ignore
        config.plugins.push(new webpack.IgnorePlugin(/css-tree$/));
    }

    if (hiddenSourceMap || sourceMap) {
        if (!!sentry && !!uploadSentry) {
            config.devtool = false;
            config.plugins.push(
                new webpack.SourceMapDevToolPlugin({
                    append: `\n//# sourceMappingURL=${process.env.SENTRY_PREFIX}[name].js.map`,
                    filename: join(process.env.SOURCEMAP_REL_DIR, '[name].js.map')
                })
            );
            let appVersion;
            let buildNumber;
            if (isAndroid) {
                const gradlePath = `${appResourcesPath}/Android/app.gradle`;
                const gradleData = readFileSync(gradlePath, 'utf8');
                appVersion = gradleData.match(/versionName "((?:[0-9]+\.?)+)"/)[1];
                buildNumber = gradleData.match(/versionCode ([0-9]+)/)[1];
            } else if (isIOS) {
                const plistPath = `${appResourcesPath}/iOS/Info.plist`;
                const plistData = readFileSync(plistPath, 'utf8');
                appVersion = plistData.match(/<key>CFBundleShortVersionString<\/key>[\s\n]*<string>(.*?)<\/string>/)[1];
                buildNumber = plistData.match(/<key>CFBundleVersion<\/key>[\s\n]*<string>([0-9]*)<\/string>/)[1];
            }
            console.log('appVersion', appVersion, buildNumber);

            config.plugins.push(
                // @ts-ignore
                new SentryCliPlugin({
                    release: appVersion,
                    urlPrefix: 'app:///',
                    rewrite: true,
                    dist: `${buildNumber}.${platform}`,
                    ignore: ['tns-java-classes', 'hot-update'],
                    include: [dist, join(dist, process.env.SOURCEMAP_REL_DIR)]
                })
            );
        } else {
            config.devtool = 'inline-nosources-cheap-module-source-map';
        }
    } else {
        config.devtool = false;
    }

    if (!!production) {
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin({
                async: false,
                typescript: {
                    configFile: resolve(tsconfig)
                }
            })
        );
    }
    config.optimization.minimize = uglify !== undefined ? uglify : production;
    const isAnySourceMapEnabled = !!sourceMap || !!hiddenSourceMap || !!inlineSourceMap;
    config.optimization.minimizer = [
        new TerserPlugin({
            parallel: true,
            terserOptions: {
                ecma: 2017,
                module: true,
                output: {
                    comments: false,
                    semicolons: !isAnySourceMapEnabled
                },
                compress: {
                    // The Android SBG has problems parsing the output
                    // when these options are enabled
                    collapse_vars: platform !== 'android',
                    sequences: platform !== 'android',
                    passes: 2,
                    drop_console: production && adhoc !== true
                },
                keep_fnames: true
            }
        })
    ];
    return config;
};
