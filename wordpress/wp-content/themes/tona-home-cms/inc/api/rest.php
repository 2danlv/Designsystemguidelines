<?php
/**
 * REST route registration.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function tona_cms_register_rest_routes() {
    register_rest_route(
        'tona/v1',
        '/resolve',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => 'tona_cms_resolve_route_payload',
        )
    );

    register_rest_route(
        'tona/v1',
        '/settings',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                tona_cms_apply_rest_language( $request );
                return rest_ensure_response( tona_cms_site_settings_payload() );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/members',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                tona_cms_apply_rest_language( $request );
                return rest_ensure_response( tona_cms_members_list_payload() );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/news',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                tona_cms_apply_rest_language( $request );
                return rest_ensure_response( tona_cms_news_list_payload() );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/news/(?P<slug>[a-z0-9-]+)',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                tona_cms_apply_rest_language( $request );
                $article = tona_cms_news_by_slug_payload( $request->get_param( 'slug' ) );

                if ( ! $article ) {
                    return new WP_Error( 'tona_news_not_found', 'News article not found.', array( 'status' => 404 ) );
                }

                return rest_ensure_response( $article );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/projects',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                tona_cms_apply_rest_language( $request );
                return rest_ensure_response( tona_cms_projects_payload() );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/projects/(?P<slug>[a-z0-9-]+)',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                tona_cms_apply_rest_language( $request );
                $project = tona_cms_project_by_slug_payload( $request->get_param( 'slug' ) );

                if ( ! $project ) {
                    return new WP_Error( 'tona_project_not_found', 'Project not found.', array( 'status' => 404 ) );
                }

                return rest_ensure_response( $project );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/jobs',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                tona_cms_apply_rest_language( $request );
                return rest_ensure_response( tona_cms_jobs_payload() );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/applicants',
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'permission_callback' => '__return_true',
            'callback'            => 'tona_cms_submit_applicant_payload',
        )
    );

    register_rest_route(
        'tona/v1',
        '/page-template/(?P<template>[a-z0-9-]+)',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                tona_cms_apply_rest_language( $request );
                $page = tona_cms_get_page_by_template( $request->get_param( 'template' ) );

                if ( ! $page ) {
                    return new WP_Error( 'tona_page_not_found', 'Page not found.', array( 'status' => 404 ) );
                }

                return rest_ensure_response( tona_cms_page_payload( $page ) );
            },
        )
    );

    register_rest_route(
        'tona/v1',
        '/pages/(?P<slug>[a-z0-9-\/]+)',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => '__return_true',
            'callback'            => function ( $request ) {
                tona_cms_apply_rest_language( $request );
                $slug = $request->get_param( 'slug' );
                $page = tona_cms_get_page_by_slug( $slug );

                if ( ! $page ) {
                    return new WP_Error( 'tona_page_not_found', 'Page not found.', array( 'status' => 404 ) );
                }

                return rest_ensure_response( tona_cms_page_payload( $page ) );
            },
        )
    );
}
add_action( 'rest_api_init', 'tona_cms_register_rest_routes' );
