/**
 * Line drawing functionality.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../Sprite";
import { color } from "../utils/Color";
import { registry } from "../Registry";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a line.
 *
 * @see {@link ILineEvents} for a list of available events
 * @see {@link ILineAdapters} for a list of available Adapters
 */
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    /**
     * Constructor
     */
    function Line() {
        var _this = _super.call(this) || this;
        _this.className = "Line";
        _this.element = _this.paper.add("line");
        _this.fill = color(); //"none";
        _this.x1 = 0;
        _this.y1 = 0;
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the line.
     *
     * @ignore Exclude from docs
     */
    Line.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this.x1 == this.x2 || this.y1 == this.y2) {
            this.pixelPerfect = true;
        }
        else {
            this.pixelPerfect = false;
        }
        this.x1 = this.x1;
        this.x2 = this.x2;
        this.y1 = this.y1;
        this.y2 = this.y2;
    };
    Object.defineProperty(Line.prototype, "x1", {
        /**
         * @return {number} X
         */
        get: function () {
            return this.getPropertyValue("x1");
        },
        /**
         * X coordinate of first end.
         *
         * @param {number} value X
         */
        set: function (value) {
            if (!$type.isNumber(value)) {
                value = 0;
            }
            this.setPropertyValue("x1", value);
            this.element.attr({ "x1": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "x2", {
        /**
         * @return {number} X
         */
        get: function () {
            var value = this.getPropertyValue("x2");
            if (!$type.isNumber(value)) {
                value = this.pixelWidth;
            }
            return value;
        },
        /**
         * X coordinate of second end.
         *
         * @param {number} value X
         */
        set: function (value) {
            if (!$type.isNumber(value)) {
                value = 0;
            }
            this.setPropertyValue("x2", value);
            this.element.attr({ "x2": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "y1", {
        /**
         * @return {number} Y
         */
        get: function () {
            return this.getPropertyValue("y1");
        },
        /**
         * Y coordinate of first end.
         *
         * @param {number} value Y
         */
        set: function (value) {
            if (!$type.isNumber(value)) {
                value = 0;
            }
            this.setPropertyValue("y1", value);
            this.element.attr({ "y1": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "y2", {
        /**
         * @return {number} Y
         */
        get: function () {
            var value = this.getPropertyValue("y2");
            if (!$type.isNumber(value)) {
                value = this.pixelHeight;
            }
            return value;
        },
        /**
         * Y coordinate of second end.
         *
         * @param {number} value Y
         */
        set: function (value) {
            if (!$type.isNumber(value)) {
                value = 0;
            }
            this.setPropertyValue("y2", value);
            this.element.attr({ "y2": value });
        },
        enumerable: true,
        configurable: true
    });
    return Line;
}(Sprite));
export { Line };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Line"] = Line;
//# sourceMappingURL=Line.js.map