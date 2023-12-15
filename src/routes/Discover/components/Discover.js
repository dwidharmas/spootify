import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import config from '../../../config';

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      loadingNewRelease: false,
      loadingPlaylist: false,
      loadingCategories: false,
      newReleases: [],
      playlists: [],
      categories: []
    };

  }
  
  componentDidMount() {
    this.fetchToken();
  }

  fetchToken = async () => {
    try {
      const response = await fetch(`${config.api.authUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${config.api.clientId}&client_secret=${config.api.clientSecret}`,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }

      const data = await response.json();
      const token = data.access_token;

      // Call the function to fetch data using the obtained token
      this.fetchNewRelease(token);
      this.fetchPlaylist(token);
      this.fetchCategories(token)
    } catch (error) {
      console.error('Error fetching token:', error.message);
    }
  };

  fetchNewRelease = async (token) => {
    try {
      this.setState({ loadingNewRelease: true})
      const response = await fetch(`${config.api.baseUrl}/browse/new-releases`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch new releases');
      }
      const data = await response.json();
      this.setState({ newReleases: data.albums.items, loadingNewRelease: false });
    } catch (error) {
      console.error('Error fetching new releases:', error.message);
    }
  };

  fetchPlaylist = async (token) => {
    try {
      this.setState({ loadingPlaylist: true})
      const response = await fetch(`${config.api.baseUrl}/browse/featured-playlists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch new releases');
      }

      const data = await response.json();
      this.setState({ playlists: data.playlists.items, loadingPlaylist: false });
    } catch (error) {
      console.error('Error fetching new releases:', error.message);
    }
  };

  fetchCategories = async (token) => {
    try {
      this.setState({ loadingCategories: true})
      const response = await fetch(`${config.api.baseUrl}/browse/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch new releases');
      }

      const data = await response.json();
      this.setState({ categories: data.categories.items, loadingCategories: false });
    } catch (error) {
      console.error('Error fetching new releases:', error.message);
    }
  };


  render() {
    const { newReleases, playlists, categories, loadingNewRelease, loadingPlaylist, loadingCategories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} loading={loadingNewRelease} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} loading={loadingPlaylist} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} loading={loadingCategories}  imagesKey="icons" />
      </div>
    );
  }
}
