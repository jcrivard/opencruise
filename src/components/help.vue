<template>
<div id="helpPage" class="page">
    <h3>Help</h3>
    <div class="app-content">
        <div class="help-collapsible" role="button" @click="getAnimation('group1')">
            <i class="material-icons">format_list_numbered</i>
            <span>Installation</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group slide-up" role="group" ref="group1">
                <div>
                    <h4>Android</h4>
                    <ul class="collapse help-left">
                        <li><span class="help-item">Chrome 57+</span> - tap the three dot menu and then "Add to Home Screen".</li>
                        <li><span class="help-item">Firefox 52+</span> - tap the three dot menu, then page, then "Add to Home Screen."</li>
                        </li>
                    </ul>
                    <h4>Desktop</h4>
                    <ul class="collapse help-left">
                        <li><span class="help-item">Chrome 57+</span> - tap the three dot menu and then "More Tools" then "Add to Desktop".</li>
                        <li><span class="help-item">Firefox 52+</span> - create a bookmark, view all bookmarks, then drag the new bookmark
                        to the desktop."</li>
                    </ul>
                    <h4>Browser Settings</h4>
                        <ul class="collapse help-left">
                            <li><span class="help-item">Javascript</span> - must be enabled.</li>
                            <li><span class="help-item">Geolocation/Notifications</span> - Respond "Allow" to prompts when prompted.</li>
                            <li><span class="help-item">Incognito/Private Browsing</span> - will not work and data will NOT BE SAVED!</li>
                            <li><span class="help-item">Deleting Cache</span> - the application uses persistent storage, but to be
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
                    <ul class="collapse help-left">
                        <li><span class="help-item">Interval -</span> confidence limits.  eg. 10 represents a confidence interval
                        of +/- 10%.</li>
                        <li><span class="help-item">Level -</span> confidence level.  eg. 95% means that there is a 95% probability
                        that the mean lies within the confidence interval.</li>
                        <li><span class="help-item">Include/Exclude Species -</span> to include or exclude certain species from the
                        calculations, select/deselect values.  When changing one field (ie. Include Species) the other field (ie.
                        Exclude Species) will automatically update to reflect the values not included in the other field.  The default is
                        for all species to be included in the calculations.</li>
                        <li><span class="help-item">Exclude Example -</span>if you are recording snags as part of your cruise, but do not
                        want to include them in the calculations, select SNAG in the Exclude Species list.</li>
                        <li><span class="help-item">Include Example -</span>if you want to know how much Yellow Birch is in your stand,
                        select only YB in the Include Species list.</li>
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
                    <li>Tap "Download" in the cruisemenu to download a cruise.  On Android/Windows/Linux the file will be downloaded to
                        the "Downloads" folder configured for your device.</li>
                </ul>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group9')">
            <i class="material-icons">airplanemode_active</i>
            <span>Offline Use</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group  slide-up" role="group" ref="group9">
                <ul id="helpOffline" class="collapse help-left">
                    <li><span class="help-item">Load application -</span>when you visit the website, or select the homescreenVisit website, or open application from home screen when you have network access.</li>
                    <li><span class="help-item">Airplace Mode -</span>use to turn off WIFI/LTE and save battery.</li>
                </ul>
            </div>
        </div>
        <div class="help-collapsible" role="button" @click="getAnimation('group10')">
            <i class="material-icons">note</i>
            <span>Output File Format</span>
        </div>
        <div class="help-collapsible-container">
            <div class="help-collapsible-group slide-up" role="group" ref="group10">
                <ul id="helpFileFormat" class="collapse help-left">
                    <li>The output file is a comma delimited file that should be directly readable by Excel, LibreOffice,
                        OpenOffice or similar products.  When opening the file, you may need to set the delimeter (Separator)
                        to a comma only.  Uncheck options for separating by Tab, Semicolon, etc...  File layout is as follows:
                        <br/><br/>
                        <ul>
                            <li><span class="help-item">Headers -</span> are included for cruise info, plot info, and tree data.</li>
                            <li><span class="help-item">Data -</span> one row for cruise data, one row for each plot and one row for each tree.</li>
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
                    <li>
                        <h4>Version 2.0</h4>
                        Initial release
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
                    <li>Version: 2.0</li>
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
@import '../variables';
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
        background-color: $opencruise-toolbar-background;
        text-align: center;
    }
    .help-item {
        font-weight: bold;
    }
    .help-left > li {
        text-align: left;
    }
    /* credit to https://github.com/leifoolsen/mdl-ext */
    .help-collapsible {
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 10px;
    }
    .help-collapsible-group {
        box-sizing: border-box;
    }
</style>
