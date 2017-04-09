<template>
<div id="helpPage" class="page">
    <h3>Help</h3>
    <div class="app-content">
        <div class="help-collapsible" role="button" @click="getAnimation('group1')">
            <i class="material-icons">format_list_numbered</i>
            <span>Support and Installation</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group slide-up" role="group" ref="group1">
                <div>
                    <h4>Mobile Support</h4>
                    <ul>
                        <li><span class="help-item">Chrome 57+ (Android):</span> tap the three dot menu and then "Add to Home Screen".</li>
                        <li><span class="help-item">Firefox 53+ (Android):</span> tap the three dot menu, then page, then "Add to Home Screen."</li>
                        </li>

                    </ul>
                    <h4>Desktop Support</h4>
                    <ul>
                        <li><span class="help-item">Chrome 57+ (any platform)</span></li>
                        <li><span class="help-item">Firefox 53+ (any platform)</span></li>
                    </ul>
                    <h4>Browser Settings</h4>
                        <ul>
                            <li>Javascript must be enabled.</li>
                            <li>Respond "Allow" to prompts for notifications and geolocation when prompted.</li>
                            <li>Incognito or private browsing will not work and data will NOT BE SAVED!</li>
                            <li>The application uses persistent storage, but to be
                                safe it is suggested to save all collected data before clearing the cache.
                            </li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
        <div class=" help-collapsible" role="button" @click="getAnimation('group2')">
            <i class="material-icons">build</i>
            <span>Configuration</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group slide-up" role="group" ref="group2">
                <div>
                    <h4>Cruise Paramaters</h4>
                    <ul id="helpConfig" class="collapse help-left">
                        <li><span class="help-item">Main Parameters -</span> The first tab on the config page allows you to enter the defaults used to create a new cruise.</li>
                        <li><span class="help-item">Default Data Fields -</span> these are the global defaults and can be changed later for each cruise.
                            The field names are the title(s) on the plot entry screen.
                            Min and max values are used during plot entry to control field colors (red is out of range).  Min field2 for field3
                             is intended to be a limit check for sawtimber.  Assuming field2
                            is DBH and field3 is a measure of Sawtimber, this value indicates the minimum diameter that a tree
                            can be to have sawtimber.  If a tree with a smaller diameter is entered and the user enters a value
                            greater than zero for sawtimber, the sawtimber field will turn red.</li>
                        <li><span class="help-item">Species codes -</span> changes made here affect all of the species dropdowns used during
                        data entry.  If you remove a species used in an existing cruise, the data itself will not be affected, but you will not be
                        able to see the deleted species on any screens. To change the order of species in the dropdowns, swap codes so that more preferred
                        species are towards the top of the list.</li>
                        <li><span class="help-item">Grade codes -</span> add, remove or change grades used when doing segment entry.</li>
                        <li><span class="help-item">BAF -</span> add or remove BAFs as needed.  It is not recommended to use more than 5 on devices
                        with smaller screens.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group3')">
            <i class="material-icons">dashboard</i>
            <span>Cruise</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group  slide-up" role="group" ref="group3">
                <div>
                    <h4>General</h4>
                    <ul class="collapse help-left">
                        <li><span class="help-item">New Cruise -</span> to create a new cruise, select "New Cruise" from the
                        navigation menu.  The new cruise will be added to the "Home" page (where you see a list of cruises).  If you
                        create a new cruise from any page other than the "Home" page, you will need to navigate to Home to open it.
                        </li>
                        <li><span class="help-item">Main parameters -</span> should be self explanatory with the exception of default species.  Default species
                        is used to prepopulate the species field when entering plot data.  This is especially handy if your cruising a stand dominated
                        by one species.</li>
                        <li><span class="help-item">Segments -</span> by default each plot only has four fields for entering data.  By turning "Segments"
                        on, you will have 14 fields available.  This is primarily intended for recording multiple products/grades for each tree, but
                        you can use it in other ways as well. </li>
                        <li><span class="help-item">Cruise Menu -</span> in the upper right of the screen, the three dot menu will allow you to
                        perform actions specific to the active cruise.</li>
                        <li><span class="help-item">Fields -</span> select "Fields" from the cruise menu to change field names along with minimum and maximum
                        values for each field.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group4')">
            <i class="material-icons">gps_fixed</i>
            <span>Plot Entry</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group  slide-up" role="group" ref="group4">
                <ul class="collapse help-left">
                        <li><span class="help-item">New Plot -</span> select "New Plot" from the cruise menu to begin plot entry.
                        </li>
                        <li><span class="help-item">PlotID -</span> a generic text field that can be used to record cover type, unique features, or
                        anything else notable about the plot.  The contents of this field, along with the plot number, are displayed in the plot
                        list screen.</li>
                        <li><span class="help-item">Data Entry -</span> use the on screen keyboard to enter data.  You can generally use the "Next"
                        key to tab to the next field.  All non dropdown fields are numeric only. </li>
                        <li><span class="help-item">More trees -</span> press the "+ Tree" button to add more trees.</li>
                        <li><span class="help-item">Save -</span> you <span style="color: red">MUST press SAVE</span> to save the plot data.  If
                        you fail to do this the plot WILL NOT be saved to the database!!!.</li>
                    </ul>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group6')">
            <i class="material-icons">gps_not_fixed</i>
            <span>Edit Plots</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group  slide-up" role="group" ref="group6">
                <ul class="collapse">
                    Tap "Plot List" in the cruise menu then tap the plot you want to edit. Make sure to press SAVE when done!
                </ul>
            </div>
        </div>
        <div class=" help-collapsible" role="button" @click="getAnimation('group7')">
            <i class="material-icons">build</i>
            <span>Statistics</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group slide-up" role="group" ref="group7">
                <div>
                    <h4>Statisticss</h4>
                    <ul id="helpConfig" class="collapse help-left">
                        <li><span class="help-item">Interval -</span> XXXXXXXXXXXXXXXXXXXXX.</li>
                        <li><span class="help-item">Default Data Fields -</span> these are the global defaults and can be changed later for each cruise.
                            The field names are the title(s) on the plot entry screen.
                            Min and max values are used during plot entry to control field colors (red is out of range, green
                            is in range).  Min field2 for field3 is intended to be a limit check for sawtimber.  Assuming field2
                            is DBH and field3 is a measure of Sawtimber, this value indicates the minimum diameter that a tree
                            can be to have sawtimber.  If a tree with a smaller diameter is entered and the user enters a value
                            greater than zero for sawtimber, the sawtimber field will turn red.</li>
                        <li><span class="help-item">Species codes -</span> changes made here affect all of the species dropdowns used during
                        data entry.  If you remove a species used in an existing cruise, the data itself will not be affected, but you will not be
                        able to see the deleted species on any screens. To change the order of species in the dropdowns, swap codes so that more preferred
                        species are towards the top of the list.</li>
                        <li><span class="help-item">Grade codes -</span> add, remove or change grades used when doing segment entry.</li>
                        <li><span class="help-item">BAF -</span> add or remove BAFs as needed.  It is not recommended to use more than 5 on devices
                        with smaller screens.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group8')">
            <i class="material-icons">file_download</i>
            <span>Download</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group  slide-up" role="group" ref="group8">
                <ul id="helpDownload" class="collapse">
                    <li>Tap "Download" in the pullout menu.</li>
                </ul>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group9')">
            <i class="material-icons">airplanemode_active</i>
            <span>Offline Use</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group  slide-up" role="group" ref="group9">
                <ul id="helpOffline" class="collapse">
                    <li>Visit website, or open application from home screen (see Browser Notes) when you have network access.</li>
                    <li>Go into "Airplane Mode" to save battery.</li>
                    <li>When done collecting data, exit airplane mode.</li>
                </ul>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group10')">
            <i class="material-icons">note</i>
            <span>Output File Format</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group slide-up" role="group" ref="group10">
                <ul id="helpFileFormat" class="collapse">
                    <li>The output file is a comma delimited file that should be directly readable by Excel, LibreOffice, OpenOffice or similar products.</li>
                    <li>When opening the file, you may need to set the delimeter (Separator) to a comma only.  Uncheck options for separating by Tab, Semicolon, etc...</li>
                    <li>File layout is as follows:
                        <ul>
                            <li>Header row for cruise info (date, person, cruise name, BAF, etc...</li>
                            <li>One row for cruise data.</li>
                            <li>Header row for plot specific data (plotid, plotnum, accuracy, latitude, longitude, etc...</li>
                            <li>One row for EACH PLOT.  Note that some fields may not currently be used.</li>
                            <li>Header row for tree data.</li>
                            <li>One row for EACH TREE.  Rows are ordered by plotnum.</li>
                            <li>Most fields should be self explanatory.  Accuracy, latitude and longitude are geolocation
                                data and should reflect the accuracy and coordinates of each plot.
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group11')">
            <i class="material-icons">attachment</i>
            <span>Release Notes</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group  slide-up" role="group" ref="group11">
                <ul id="helpRelease" class="collapse">
                    <li>Version 1.3.2
                        <ul>
                            <li>Added statistics popup on cruise screen.</li>
                            <li>Renamed apple-touch-icon.png to icon.png.</li>
                            <li>Added manifest.json for better homescreen experience.</li>
                        </ul>
                    </li>
                    <li>Version 1.3.0
                        <ul>
                            <li>Disabled init parameter for field configuration since it is not implemented.</li>
                            <li>User interface enhancements.</li>
                            <li>Add support for loading from file URL.</li>
                            <li>Fix Firefox/localstorage bug during initial config.</li>
                            <li>Add service worker support.</li>
                            <li>Update to Jquery Mobile 1.4.5.</li>
                            <li>Update to Knockout.js 3.4.0.</li>
                        </ul>
                    </li>
                    <li>Version 1.2.3
                        <ul>
                            <li>Reworked speech input routines - see help for new instructions.</li>
                        </ul>
                    </li>
                    <li>Version 1.2.0122.1
                        <ul>
                            <li>Fixed problem with sticky cache files.</li>
                            <li>Add prompt for user to reload after version update.</li>
                        </ul>
                    </li>
                    <li>Version 1.2.0115.1
                        <ul>
                            <li>Incorporated jquery-mobile V1.4.0 for improved performance.</li>
                            <li>Incorporated knockout.js V3.0.0 for improved performance.</li>
                            <li>Config - fixed species delete button overlap for small mobile devices.</li>
                            <li>Reworked button markup to take advantage of JQM 1.4.0 performance enhancements.</li>
                            <li>Fixed error with default cruiseparms not being saved to localstorage.</li>
                            <li>Removed fastclick.js library.</li>
                        </ul>
                    </li>
                    <li>Version 1.1.0925.2
                        <ul>
                            <li>Removed default sawlog value to fix Firefox tab issue.</li>
                            <li>Added ability to configure field defaults for each cruise as opposed to globally.</li>
                            <li>Added multi product mode.</li>
                            <li>Add ability to download data as a file for browsers that support BLOB URLs.</li>
                            <li>Bigger dialog close buttons.</li>
                            <li>Add workaround for IOS 7 Safari bugs related to page navigation.</li>
                        </ul>
                    </li>
                    <li>Version 1.1.1023.1
                        <ul>
                            <li>Workaround for Firefox indexedDB index creation bug.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group12')">
            <i class="material-icons">nature_people</i>
            <span>About</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group  slide-up" role="group" ref="group12">
                <ul id="helpAbout" class="collapse">
                    <li>Version: 1.3.1</li>
                    <li>OpenCruise is open source and licensed under the :
                        <a href="http://www.gnu.org/copyleft/gpl.html">GNU Public License Version 3.</a></li>
                    <li>Developed by <a href="mailto:jcrivard@mtu.edu">Jim Rivard.</a></li>
                </ul>
            </div>
        </div>

    </div><!-- /content -->

</div><!-- /page helpPage -->
</template>

<script>
export default {
    name: 'help',
    computed: {
        isActive: function (element) {
            alert(element);
            return {
                'slide-down': true,
                'slide-up': false
            }
        }
    },
    methods: {
        getAnimation (ref) {
            let element = this.$refs[ref];
            if (!element.classList.contains('is-expanded')) {
                let height = element.childNodes[0].clientHeight + 50;
                element.setAttribute('style', 'max-height:' + height + 'px');
            }else {
                element.setAttribute('style', 'max-height: 0');
            }
            element.classList.toggle('is-expanded');
        }
    }
}
</script>

<style scoped lang="scss">
    .slide-up {
        max-height: 0;
        overflow: hidden;
        position: relative;
        transition-timing-function: ease;
        transition-property: max-height;
        transition-duration: .55s;
    }
    i {
        padding-right: 5px;
    }
    ul {
        list-style-type: none;
    }
    .app-content {
        text-align: center;
        overflow: hidden;
    }
    .help-collapsible-container {
        overflow: auto;
        background-color: #eee;
        text-align: center;
    }
    .help-item {
        font-weight: bold;
    }
    .help-left > li {
        text-align: left;
    }
    /* credit to https://github.com/leifoolsen/mdl-ext */
    @mixin help-visually-hidden() {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }
    .help-collapsible {
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 10px;
    }
    .help-collapsible-group,
    .help-collapsible-region {
        box-sizing: border-box;
        &[hidden] {
            @include help-visually-hidden;
            pointer-events: none;
        }
    }
</style>
